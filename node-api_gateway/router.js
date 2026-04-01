const { forwardRequest } = require('./proxy');
const { verifyToken, handleLoginRequest } = require('./auth');

async function handleRoute(req, res) {
    const url = req.url;

    // 1. Xử lý các Route không cần xác thực (Public)
    // Cho phép login và route test của collab chạy mà không cần token
    if (url.startsWith('/api/auth/login')) {
        return handleLoginRequest(req, res);
    }
    
    if (url.startsWith('/api/collab/test')) {
        return forwardRequest(req, res, 'http://localhost:5166');
    }

    // 2. Middleware tự chế: Kiểm tra Token trước khi đi tiếp cho các route còn lại
    const isAuth = verifyToken(req);
    if (!isAuth) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: 'Unauthorized: Invalid or missing token' }));
    }

    // 3. Phân luồng Proxy dựa trên tiền tố URL
    if (url.startsWith('/api/collab')) {
        // Chuyển tiếp tất cả các yêu cầu /api/collab/... sang C# Microservice
        return forwardRequest(req, res, 'http://localhost:5166'); 
    } 
    else if (url.startsWith('/api/content')) {
        return forwardRequest(req, res, 'http://localhost:8080');
    }
    else if (url.startsWith('/api/chat') || url.startsWith('/ws')) {
         return forwardRequest(req, res, 'http://localhost:4000');
    }

    // 4. Nếu không khớp route nào
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route not found in API Gateway' }));
}

module.exports = { handleRoute };