const http = require('http');
const https = require('https');
const url = require('url');

// Service Registry (Đọc từ biến môi trường để tương thích với Docker networking, fallback nội bộ nếu chạy ngoài)
const SERVICES = {
    collab: process.env.SERVICE_COLLAB_URL || 'http://localhost:5166',
    projects: process.env.SERVICE_PROJECTS_URL || 'http://localhost:8080',
    ai: process.env.SERVICE_AI_URL || 'http://localhost:8000'
};

/**
 * HÀM CHUYỂN TIẾP (REVERSE PROXY)
 * @param {Object} req - Request gốc từ Client
 * @param {Object} res - Response gốc để trả về Client
 * @param {Object} userPayload - Thông tin giải mã từ JWT (userId, role)
 */
function proxyRequest(req, res, userPayload) {
    const parsedUrl = url.parse(req.url);
    const path = parsedUrl.pathname;

    // 1. Dẫn đường (Routing) tới đúng Service
    let targetBaseUrl = null;
    if (path.startsWith('/api/collab')) targetBaseUrl = SERVICES.collab;
    else if (path.startsWith('/api/projects')) targetBaseUrl = SERVICES.projects;
    else if (path.startsWith('/api/ai')) targetBaseUrl = SERVICES.ai;
    
    if (!targetBaseUrl) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: "Service Gateway Route Not Found" }));
    }

    const targetUrl = new URL(path + (parsedUrl.search || ''), targetBaseUrl);

    // 2. Chuẩn bị Headers (Bơm thêm định danh User)
    const headers = { ...req.headers };
    delete headers.host; // Xóa host của Node.js để tự động nhận host của C#/Java

    if (userPayload) {
        // Đây là điểm then chốt: C# và Java sẽ chỉ đọc 2 header này để biết ai đang gọi API
        headers['X-User-Id'] = userPayload.userId;
        headers['X-User-Role'] = userPayload.role;
    }

    const options = {
        hostname: targetUrl.hostname,
        port: targetUrl.port,
        path: targetUrl.pathname + targetUrl.search,
        method: req.method,
        headers: headers
    };

    // Chọn client HTTP hoặc HTTPS dựa theo URL đích
    const client = targetUrl.protocol === 'https:' ? https : http;

    // 3. Khởi tạo Request sang Microservice
    const proxyReq = client.request(options, (proxyRes) => {
        // Lấy HTTP Code (200, 400, 500) và Header từ C#/Java ném thẳng về lại cho React/Frontend
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        
        // PIPE (Bơm) dữ liệu trả về sang Response của Client (Tối ưu RAM)
        proxyRes.pipe(res, { end: true });
    });

    // 4. Bắt lỗi nếu Microservice bị chết (Ví dụ bạn quên chạy code C#)
    proxyReq.on('error', (err) => {
        console.error(`[Proxy Error] Cổng ${targetUrl.port} từ chối kết nối:`, err.message);
        if (!res.headersSent) {
            res.writeHead(502, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: "Bad Gateway - Microservice đang offline" }));
        }
    });

    // 5. PIPE (Bơm) dữ liệu gửi lên (Body/JSON/File) từ Client chạy thẳng vào Microservice
    req.pipe(proxyReq, { end: true });
}

module.exports = { proxyRequest };