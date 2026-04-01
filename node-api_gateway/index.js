require('dotenv').config();
const http = require('http');
const { handleRoute } = require('./router');

const PORT = process.env.GATEWAY_PORT || 3000;

// DANH SÁCH TRẮNG: Chỉ định chính xác Frontend nào được phép gọi API
const ALLOWED_ORIGINS = [
    'http://127.0.0.1:5500', // Port của Live Server (Frontend Vanilla JS)
    'http://localhost:5500', 
    'https://ten-mien-that-cua-ban.com'
];

const server = http.createServer(async (req, res) => {
    // 1. Kiểm tra Origin (Nguồn gốc request)
    const origin = req.headers.origin;
    if (ALLOWED_ORIGINS.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
        // Nếu không có origin (ví dụ gọi từ Postman) thì cho phép tạm lúc dev
        // Trên Production, có thể chặn luôn bằng cách set cứng 1 origin
        res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGINS[0]); 
    }

    // 2. Chỉ định rõ những Method và Header nào được phép
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // Quan trọng nếu sau này bạn dùng cookie thay vì gửi Token qua header
    res.setHeader('Access-Control-Allow-Credentials', 'true'); 

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    await handleRoute(req, res);
});

server.listen(PORT, () => {
    console.log(`API Gateway is running securely on port ${PORT}`);
});