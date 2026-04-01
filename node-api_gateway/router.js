const { forwardRequest } = require('./proxy');
const { verifyToken, handleLoginRequest } = require('./auth');

async function handleRoute(req, res) {
    const url = req.url;

    // 1. Xử lý các Route không cần xác thực (Public)
    if (url.startsWith('/api/auth/login')) {
        return handleLoginRequest(req, res);
    }

    // 2. Middleware tự chế: Kiểm tra Token trước khi đi tiếp
    const isAuth = verifyToken(req);
    if (!isAuth) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: 'Unauthorized: Invalid or missing token' }));
    }

    // 3. Phân luồng Proxy dựa trên tiền tố URL
    if (url.startsWith('/api/collab')) {
        // Cổng của C# .NET Core service (ví dụ port 5000)
        return forwardRequest(req, res, 'http://localhost:5166'); 
    } 
    else if (url.startsWith('/api/content')) {
        // Cổng của Java Spring Boot service (ví dụ port 8080)
        return forwardRequest(req, res, 'http://localhost:8080');
    }
    else if (url.startsWith('/api/chat') || url.startsWith('/ws')) {
         // Cổng của Go service (ví dụ port 4000)
         // Lưu ý: WebSocket sẽ cần logic nâng cấp kết nối (Upgrade) riêng
         return forwardRequest(req, res, 'http://localhost:4000');
    }

    // 4. Nếu không khớp route nào
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route not found in API Gateway' }));
}

module.exports = { handleRoute };