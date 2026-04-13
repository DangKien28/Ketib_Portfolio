using dotnet_collab.Helpers;
using dotnet_collab.Repositories;
using dotnet_collab.Services;

var builder = WebApplication.CreateBuilder(args);

// Bỏ qua SSL Verification cho môi trường Docker LAN (nếu gateway gọi qua HTTP)
// Gateway Nodejs đảm nhiệm xử lý chặn từ bên ngoài
// 1. Đăng ký các dịch vụ (Dependency Injection) theo nguyên tắc SOLID

// Cấu hình DatabaseHelper kết nối với biến cấu hình
builder.Services.AddSingleton<DatabaseHelper>();

// Cấu hình Repository pattern sử dụng Npgsql với các store procedures đã định nghĩa
builder.Services.AddScoped<ICollabRepository, CollabRepository>();

// Khai báo Bussiness Logic Layer với Service
builder.Services.AddScoped<CollabService>();

// 2. Thêm Controllers
// Tự động quét và nạp CollabController
builder.Services.AddControllers();

// (Tuỳ chọn) Bật Swagger để dễ test các Endpoint nội bộ nếu muốn
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 3. Middlewares Pipeline

// Do chạy ẩn sau Node API Gateway trong Docker network nên có thể dùng Swagger mọi lúc
app.UseSwagger();
app.UseSwaggerUI();

app.UseRouting();

// Bỏ qua UseCors() hay UseAuthentication() ở đây vì Node.js API Gateway đã làm thay nhiệm vụ đó. 
// Nếu Gateway verify Magic Link / JWT thành công, nó sẽ pass header "X-User-Id" sang đây qua Proxy.
app.UseAuthorization();

app.MapControllers();

app.Run();
