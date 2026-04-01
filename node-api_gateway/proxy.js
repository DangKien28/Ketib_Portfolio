const http = require('http');

function forwardRequest(clientReq, clientRes, targetBaseUrl) {
    // Phân tích URL đích
    const targetUrl = new URL(clientReq.url, targetBaseUrl);
    
    const options = {
        hostname: targetUrl.hostname,
        port: targetUrl.port,
        path: targetUrl.pathname + targetUrl.search,
        method: clientReq.method,
        headers: clientReq.headers // Truyền nguyên header (bao gồm cả JWT) sang service đích
    };

    // Tạo request gửi đến microservice
    const proxyReq = http.request(options, (proxyRes) => {
        // Copy status code và headers từ service đích trả về client
        clientRes.writeHead(proxyRes.statusCode, proxyRes.headers);
        
        // Pipe dữ liệu trực tiếp (stream) để tối ưu RAM
        proxyRes.pipe(clientRes, { end: true });
    });

    // Xử lý lỗi nếu service đích chết
    proxyReq.on('error', (err) => {
        console.error('Proxy Error:', err);
        clientRes.writeHead(502, { 'Content-Type': 'application/json' });
        clientRes.end(JSON.stringify({ message: 'Bad Gateway: Microservice is unreachable' }));
    });

    // Chuyển tiếp body (đối với POST/PUT) từ client sang microservice
    clientReq.pipe(proxyReq, { end: true });
}

module.exports = { forwardRequest };