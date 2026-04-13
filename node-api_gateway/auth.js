const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { getDB } = require('./db');

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRATION = '7d'; // Token sống 7 ngày

/**
 * 1. TẠO MAGIC LINK (Lưu trạng thái vào MongoDB)
 * @param {string} email - Email người dùng yêu cầu đăng nhập
 */
async function createMagicLink(email) {
    if (!email) throw new Error("Email là bắt buộc");

    const db = getDB();
    const sessions = db.collection('auth_sessions');

    // Tạo một chuỗi ngẫu nhiên 32 bytes (64 ký tự hex)
    const magicToken = crypto.randomBytes(32).toString('hex');

    // Lưu vào MongoDB để kiểm soát Replay Attack
    await sessions.insertOne({
        email: email,
        magic_token: magicToken,
        status: 'pending',
        created_at: new Date(),
        expires_at: new Date(Date.now() + 15 * 60000) // Hết hạn sau 15 phút
    });

    // LƯU Ý: Ở dự án thực tế, bạn sẽ đưa magicToken này vào RabbitMQ để go-notification gửi email.
    // Hiện tại Gateway sẽ trả về để hiển thị tạm trên log/response.
    return magicToken;
}

/**
 * 2. XÁC THỰC MAGIC LINK & CẤP JWT
 * @param {string} token - Chuỗi magic token từ URL người dùng click
 */
async function verifyMagicLinkAndIssueJWT(token) {
    const db = getDB();
    const sessions = db.collection('auth_sessions');

    // Tìm token trong DB
    const session = await sessions.findOne({ magic_token: token });

    if (!session) {
        throw new Error("Magic Link không tồn tại hoặc không hợp lệ.");
    }
    if (session.status !== 'pending') {
        throw new Error("Magic Link này đã được sử dụng.");
    }
    if (new Date() > session.expires_at) {
        throw new Error("Magic Link đã hết hạn (quá 15 phút).");
    }

    // Đánh dấu là đã sử dụng (Vô hiệu hóa link cũ)
    await sessions.updateOne(
        { _id: session._id },
        { $set: { status: 'used', used_at: new Date() } }
    );

    // Cấp phát JWT chính thức
    const payload = {
        userId: session.email, // Dùng email làm ID định danh tạm thời
        role: session.email === 'admin@tkien.tech' ? 'ADMIN' : 'USER'
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
    return accessToken;
}

/**
 * 3. KIỂM TRA JWT (Middleware cho các API cần bảo mật)
 * @param {Object} req - HTTP Request
 */
function validateJWT(req) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error("Missing or invalid Authorization header");
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded; // Trả về payload (userId, role) để các service khác dùng
    } catch (err) {
        throw new Error("Token đã hết hạn hoặc không hợp lệ");
    }
}

module.exports = {
    createMagicLink,
    verifyMagicLinkAndIssueJWT,
    validateJWT
};