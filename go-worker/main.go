package main

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/joho/godotenv"
	amqp "github.com/rabbitmq/amqp091-go"
)

// Khai báo cấu trúc Job
type AIDocumentJob struct {
	JobId      string `json:"job_id"`
	Content    string `json:"content"`
	ActionType string `json:"action_type"` // "MATCH_JD" or "ESTIMATE_COST"
}

func main() {
	// 1. TẢI BIẾN MÔI TRƯỜNG AN TOÀN TỪ ROOT
	dir, err := os.Getwd()
	if err != nil {
		log.Fatal(err)
	}
	// Lấy file .env ở thư mục cha
	envPath := filepath.Join(filepath.Dir(dir), ".env")
	if err := godotenv.Load(envPath); err != nil {
		log.Println("Không tìm thấy file .env, chuyển sang sử dụng System ENV var")
	}

	queueURL := os.Getenv("RABBITMQ_URL")
	if queueURL == "" {
		queueURL = "amqp://user:password@localhost:5672/"
	}

	// 2. KẾT NỐI RABBITMQ
	conn, err := amqp.Dial(queueURL)
	if err != nil {
		log.Fatalf("Lỗi kết nối RabbitMQ cực kỳ nguy hiểm (%s): %v", queueURL, err)
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		log.Fatalf("Không thể mở Channel an toàn: %v", err)
	}
	defer ch.Close()

	// Khai báo hàng đợi (Durable = true để đảm bảo an toàn không mất dữ liệu)
	q, err := ch.QueueDeclare(
		"ai_processing_queue", // name
		true,                  // durable
		false,                 // delete when unused
		false,                 // exclusive
		false,                 // no-wait
		nil,                   // arguments
	)
	if err != nil {
		log.Fatalf("Cấu hình Queue thất bại: %v", err)
	}

	// Lấy dữ liệu an toàn
	msgs, err := ch.Consume(
		q.Name, // queue
		"",     // consumer
		false,  // auto-ack (KHÔNG auto, để kiểm soát khi có lỗi AI)
		false,  // exclusive
		false,  // no-local
		false,  // no-wait
		nil,    // args
	)
	if err != nil {
		log.Fatalf("Đăng ký Consumer thất bại: %v", err)
	}

	var forever chan struct{}

	log.Printf(" [*] Go Worker Đang Lắng Nghe Trên Queue %s. Nhấn CTRL+C để thoát.", q.Name)

	pythonAiEndpoint := os.Getenv("PYTHON_AI_URL")
	if pythonAiEndpoint == "" {
		pythonAiEndpoint = "http://localhost:8000"
	}

	go func() {
		for d := range msgs {
			log.Printf("📥 Nhận yêu cầu: %s", d.Body)

			// 3. SANITIZATION VÀ VALIDATION (Bảo mật luồng dữ liệu)
			var job AIDocumentJob
			if err := json.Unmarshal(d.Body, &job); err != nil {
				log.Printf("❌ Dữ liệu không hợp lệ (Reject msg): %v", err)
				d.Reject(false) // Bỏ qua dữ liệu tấn công hoặc lỗi format
				continue
			}

			// 4. KẾT NỐI NỘI BỘ VỚI PYTHON AI
			payloadBytes, _ := json.Marshal(job)
			resp, err := http.Post(pythonAiEndpoint+"/process", "application/json", bytes.NewBuffer(payloadBytes))
			
			if err != nil {
				log.Printf("🔴 Lỗi kêt nối đến Python AI: %v", err)
				// Nack msg, trả lại Queue để retry sau (vì lỗi nội bộ, không phải tại dữ liệu)
				d.Nack(false, true)
				continue
			}
			
			// Giải phóng tài nguyên ngay lập tức ngăn Memory Leak
			resp.Body.Close()

			if resp.StatusCode == http.StatusOK {
				log.Printf("✅ Xử lý thành công JobId %s", job.JobId)
				// 5. ACKNOWLEDGE (Xác nhận hoàn thành, xóa khỏi Queue)
				d.Ack(false)
			} else {
				log.Printf("⚠️ Python AI từ chối JobId %s với mã: %d", job.JobId, resp.StatusCode)
				d.Nack(false, true)
			}
		}
	}()

	<-forever
}
