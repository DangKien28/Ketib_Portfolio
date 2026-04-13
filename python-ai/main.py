import os
import json
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from dotenv import load_dotenv

# Load biến hệ thống từ file .env trong cùng thư mục
current_dir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(current_dir, '.env')

if os.path.exists(env_path):
    load_dotenv(dotenv_path=env_path)
else:
    load_dotenv() # Load biến hệ thống dự phòng

# Khởi tạo App chặn mọi loại nguồn gốc bên ngoài bừa bãi
app = FastAPI(title="JD Matching AI Core", docs_url=None, redoc_url=None) # Cắt Docs giảm bề mặt tấn công

class JobPayload(BaseModel):
    job_id: str
    content: str
    action_type: str

from google import genai
from google.genai import types

# Khởi tạo Client Gemini từ biến môi trường
api_key = os.getenv("GEMINI_API_KEY")
if not api_key :
    print("WARNING: GEMINI_API_KEY is missing or invalid. AI execution will fail.")

client = None
if api_key and api_key not in ["điền_api_key_cua_ban_vao_day", "YOUR_GEMINI_API_KEY_HERE"]:
    client = genai.Client(api_key=api_key)

# Lõi xử lý AI logic (GỌI THỰC TẾ)
def process_ai_logic(content: str, action: str) -> dict:
    if not client:
        raise ValueError("Missing Gemini API Key. Cannot proceed AI Logic.")

    # Validation an toàn Action
    if action == "MATCH_JD":
        system_instructions = (
            "Bạn là chuyên gia nhân sự đánh giá các JD (Job Description) công nghệ thông tin. "
            "Kỹ năng của ứng viên (TKIEN): Hệ thống Backend phân tán cao, Node.js, Rust, Go, C#, Microservices, Docker. "
            "Nhiệm vụ: Trả về một chuỗi JSON chuẩn thuần túy, KHÔNG CÓ BLOCK QUOTE (```json...```). "
            "Cấu trúc JSON bắt buộc: { \"match_score\": <số 0-100>, \"analysis\": \"vài câu phân tích chuyên môn\", \"recommendation\": \"phù hợp/không phù hợp\" }. "
            "Nội dung JD khách đưa là:"
        )
    elif action == "ESTIMATE_COST":
        system_instructions = (
            "Bạn là Project Manager công nghệ với nhiều năm kinh nghiệm quản trị. "
            "Dựa trên nội dung dự án khách mô tả, hãy ước lượng quy mô, số giờ thiết kế và chi phí dự tính. "
            "Rate cơ sở của ứng viên: $45/h. "
            "Nhiệm vụ: Trả về LÀ MỘT CHUỖI JSON ĐÚNG CHUẨN, không kèm Block Markdown. "
            "Cấu trúc: { \"estimated_hours\": <số>, \"cost_range\": \"<khoảng chi phí VD: $1000 - $2000>\", \"analysis\": \"giải thích độ phức tạp và hướng giải quyết\" }. "
            "Nội dung dự án là:"
        )
    else:
        raise ValueError(f"Unguarded Action Type: {action}")

    # Cấu hình gọi AI an toàn, chống spam token
    prompt = f"{system_instructions}\n\n[USER INPUT]:\n{content}"
    
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.2, 
                max_output_tokens=2048, # Nới lỏng token một chút để không bị ngắt câu tiếng Việt
                response_mime_type="application/json", # BẮT BUỘC: Ép AI trả về JSON chuẩn, không bọc markdown
            ),
        )
        
        raw_output = response.text.strip()
        
        # Xóa backticks markdown mà LLM thỉnh thoảng dư thừa
        if raw_output.startswith("```json"):
            raw_output = raw_output[7:]
        if raw_output.startswith("```"):
            raw_output = raw_output[3:]
        if raw_output.endswith("```"):
            raw_output = raw_output[:-3]
        
        # Parse JSON trả về
        return json.loads(raw_output.strip())

    except json.JSONDecodeError as e:
        print(f"AI JSON Parse Error: {e} - Raw Output: {response.text}")
        raise ValueError("AI engine responded with unparseable data.")
    except Exception as e:
        print(f"Gemini API Error: {e}")
        raise RuntimeError(f"Engine Failure: {e}")

@app.post("/process")
async def process_job(payload: JobPayload, request: Request):
    """
    Điểm đón tin nội bộ từ Go Worker.
    Chúng ta không bật CORS, có nghĩa là Browser không thể chọc vào đây!
    Chỉ có các internal services (Go, Node) gọi server-to-server mới lọt qua được.
    """
    
    # Optional Security: Chặn các Request nếu Client host không phải là Go Container
    # Để an toàn nhất, có thể kiểm tra IP nguồn. Nhưng Docker network thường tự động bảo vệ.
    
    # Trích xuất dữ liệu, Cắt dữ liệu text nếu quá dài chống DDoS qua Memory Blowup
    safe_content = payload.content[:10000] # Giới hạn 10,000 ký tự cho an toàn bộ nhớ
    
    try:
        result = process_ai_logic(safe_content, payload.action_type)
        return {
            "status": "success",
            "job_id": payload.job_id,
            "payload": result
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        # Ẩn internal trace đối với Client
        raise HTTPException(status_code=500, detail="Internal AI Engine Error")

# Để chạy: uvicorn main:app --host 0.0.0.0 --port 8000
