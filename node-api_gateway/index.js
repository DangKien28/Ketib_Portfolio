require('dotenv').config();
const http = require('http');
const { handleRoute } = require('./router');
const { connectDB } = require('./db'); // Import logic kết nối từ file db.js

const PORT = process.env.GATEWAY_PORT || 3000;

// Các domain được phép truy cập (Giữ nguyên theo project hiện tại)
const ALLOWED_ORIGINS = ['http://localhost:5500', 'http://127.0.0.1:5500'];

const server = http.createServer(async (req, res) => {
    const origin = req.headers.origin;
    
    // Thiết lập CORS
    if (ALLOWED_ORIGINS.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Xử lý Preflight request
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Điều hướng request sang router
    try {
        await handleRoute(req, res);
    } catch (error) {
        console.error("❌ Gateway Error:", error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Internal Server Error at Gateway" }));
    }
});

/**
 * PHƯƠNG PHÁP CỦA KỸ SƯ CHUYÊN NGHIỆP:
 * Chúng ta không gọi server.listen() ngay lập tức. 
 * Thay vào đó, chúng ta đợi kết nối MongoDB Atlas thành công trước.
 */
async function startServer() {
    try {
        // 1. Kết nối Database trung tâm
        await connectDB();
        
        // 2. Sau khi DB sẵn sàng, mới mở port nhận request
        server.listen(PORT, () => {
            console.log(`🚀 API Gateway is running securely on port ${PORT}`);
            console.log(`🔗 MongoDB Atlas is connected and ready.`);
        });
    } catch (error) {
        console.error("🛑 Lỗi nghiêm trọng: Không thể khởi động Gateway do lỗi kết nối Database.");
        console.error(error);
        process.exit(1); // Dừng tiến trình nếu DB "chết"
    }
}

startServer();