using dotnet_collab.Helpers;
using dotnet_collab.Repositories;
using dotnet_collab.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. Thêm dịch vụ hỗ trợ Controllers
builder.Services.AddControllers();

// =========================================================================
// 2. ĐĂNG KÝ DEPENDENCY INJECTION (DI CONTAINER)
// =========================================================================
builder.Services.AddSingleton<DatabaseHelper>();
builder.Services.AddScoped<ICollabRepository, CollabRepository>();
builder.Services.AddScoped<CollabService>();

var app = builder.Build();

// =========================================================================
// 3. CẤU HÌNH HTTP REQUEST PIPELINE (MIDDLEWARE)
// =========================================================================

// Bật middleware xác thực, phân quyền cơ bản
app.UseAuthorization();

// Ánh xạ các HTTP Request tới đúng Controller
app.MapControllers();

// Khởi chạy ứng dụng
app.Run();