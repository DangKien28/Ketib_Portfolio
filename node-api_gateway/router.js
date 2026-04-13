const url = require('url');
const { createMagicLink, verifyMagicLinkAndIssueJWT, validateJWT } = require('./auth');
const { proxyRequest } = require('./proxy');

/**
 * Hàm phụ trợ: Đọc dữ liệu JSON từ HTTP Request Body (Vì không dùng Express)
 */
function getRequestBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                // Nếu không có body thì trả về object rỗng
                resolve(body ? JSON.parse(body) : {});
            } catch (err) {
                reject(new Error("Định dạng JSON không hợp lệ"));
            }
        });
    });
}

/**
 * HÀM ĐIỀU PHỐI CHÍNH (Traffic Controller)
 */
async function handleRoute(req, res) {
    // Ép kiểu phản hồi luôn là JSON
    res.setHeader('Content-Type', 'application/json');

    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method;

    try {
        // =========================================================
        // 1. NHÓM API PUBLIC (KHÔNG CẦN TOKEN)
        // =========================================================

        // 1.1. Yêu cầu tạo Magic Link
        if (path === '/api/auth/request-link' && method === 'POST') {
            const body = await getRequestBody(req);
            if (!body.email) {
                res.writeHead(400);
                return res.end(JSON.stringify({ error: "Thiếu trường 'email' trong body" }));
            }

            // Gọi hàm xử lý và lưu DB
            const magicToken = await createMagicLink(body.email);
            
            res.writeHead(200);
            return res.end(JSON.stringify({ 
                message: "Magic link đã được khởi tạo thành công.",
                // LƯU Ý KỸ SƯ: Ở môi trường thật, token này gửi qua email.
                // Trả về trực tiếp ở đây để bạn dễ test qua Postman trước khi có go-notification.
                _debug_link: `http://localhost:${process.env.GATEWAY_PORT || 3000}/api/auth/verify?token=${magicToken}` 
            }));
        }

        // 1.2. Xác thực Token từ Link và cấp JWT
        if (path === '/api/auth/verify' && method === 'GET') {
            const token = parsedUrl.query.token;
            if (!token) {
                res.writeHead(400);
                return res.end(JSON.stringify({ error: "Thiếu tham số 'token' trên URL" }));
            }

            // Kiểm tra DB và sinh JWT
            const accessToken = await verifyMagicLinkAndIssueJWT(token);
            
            res.writeHead(200);
            return res.end(JSON.stringify({ 
                message: "Xác thực thành công", 
                accessToken: accessToken 
            }));
        }

        // =========================================================
        // 2. NHÓM API PRIVATE (BẮT BUỘC CÓ JWT)
        // =========================================================
        
        if (path.startsWith('/api/')) {
            // Bước 1: Chặn ở cửa, kiểm tra Token hợp lệ không
            const userPayload = validateJWT(req);
            
            // Bước 2: Bóc tách thông tin user và chuyển tiếp request (Proxy)
            // Không được dùng res.end() ở đây nữa, proxy sẽ tự lo việc trả kết quả
            return proxyRequest(req, res, userPayload);
        }

        // =========================================================
        // 3. FALLBACK: Sai URL
        // =========================================================
        res.writeHead(404);
        res.end(JSON.stringify({ error: "Không tìm thấy API (404 Not Found)" }));

    } catch (error) {
        // XỬ LÝ LỖI TẬP TRUNG (Centralized Error Handling)
        console.error(`[Gateway Error] ${method} ${path}:`, error.message);
        
        // Phân loại lỗi để trả về HTTP Status Code chuẩn
        let statusCode = 500;
        if (error.message.includes("không hợp lệ") || error.message.includes("hết hạn") || error.message.includes("Missing")) {
            statusCode = 401; // Unauthorized
        } else if (error.message.includes("bắt buộc") || error.message.includes("đã được sử dụng")) {
            statusCode = 400; // Bad Request
        }

        res.writeHead(statusCode);
        res.end(JSON.stringify({ error: error.message }));
    }
}

module.exports = { handleRoute };