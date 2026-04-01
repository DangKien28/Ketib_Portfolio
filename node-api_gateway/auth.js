const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';

function verifyToken(req) {
    // Đọc token từ header Authorization: Bearer <token>
    const authHeader = req.headers['authorization'];
    if (!authHeader) return false;

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        // Có thể gán thông tin user vào req để dùng về sau
        req.user = decoded; 
        return true;
    } catch (err) {
        return false;
    }
}

function handleLoginRequest(req, res) {
    // Logic đọc stream body thuần để lấy email khách hàng
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    
    req.on('end', () => {
        try {
            const data = JSON.parse(body);
            const userEmail = data.email; // Ví dụ: client_email trong hệ thống

            // TẠM THỜI: In ra console. Sau này sẽ gọi qua Go/Sendgrid để gửi email
            const magicToken = jwt.sign({ email: userEmail, role: 'client' }, JWT_SECRET, { expiresIn: '15m' });
            console.log(`[Giả lập gửi Email] Magic Link: http://your-frontend.com/verify?token=${magicToken}`);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Magic link sent to your email' }));
        } catch (e) {
            res.writeHead(400);
            res.end(JSON.stringify({ message: 'Invalid JSON body' }));
        }
    });
}

module.exports = { verifyToken, handleLoginRequest };