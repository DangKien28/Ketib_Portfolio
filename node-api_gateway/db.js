const { MongoClient } = require('mongodb');

let dbInstance = null; // Biến lưu trữ kết nối duy nhất (Singleton)

async function connectDB() {
    // Nếu đã có kết nối rồi thì trả về luôn, không tạo mới
    if (dbInstance) return dbInstance;

    const uri = process.env.Connection_Mongo;
    if (!uri) {
        console.error("❌ Lỗi: Chưa cấu hình MONGO_URI trong file .env");
        process.exit(1);
    }

    try {
        // Tạo client kết nối với các thiết lập tối ưu Pool
        const client = new MongoClient(uri, {
            maxPoolSize: 10, // Duy trì tối đa 10 kết nối đồng thời
        });
        
        await client.connect();
        console.log("✅ Đã kết nối thành công tới MongoDB Atlas!");
        
        // Chỉ định database sử dụng, ví dụ: 'gateway_db'
        dbInstance = client.db('gateway_db'); 
        return dbInstance;
    } catch (error) {
        console.error("❌ Lỗi kết nối MongoDB:", error);
        process.exit(1); // Dừng hoàn toàn server nếu không có DB
    }
}

// Hàm này để các file khác gọi và lấy db instance đã kết nối
function getDB() {
    if (!dbInstance) {
        throw new Error("❌ Cần gọi connectDB() trước khi getDB()!");
    }
    return dbInstance;
}

module.exports = { connectDB, getDB };