// File: Program.cs
using DotNetEnv;
using Microsoft.AspNetCore.Mvc;
using dotnet_collab.Models;
using dotnet_collab.Repositories;
using dotnet_collab.States;

Env.Load("../.env");

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddScoped<CollabRepository>();
var app = builder.Build();

// API tạo mới yêu cầu (Mô phỏng Client gửi yêu cầu)
app.MapPost("/api/collab/create", async ([FromBody] Collaboration request, CollabRepository repo) => {
    try 
    {
        var newId = await repo.CreateCollabAsync(request);
        return Results.Ok(new { message = "Tạo thành công!", id = newId });
    } 
    catch (Exception ex) 
    {
        return Results.Problem($"Lỗi DB: {ex.Message}");
    }
});

// API lấy chi tiết yêu cầu
app.MapGet("/api/collab/{id:guid}", async (Guid id, CollabRepository repo) => {
    try 
    {
        var data = await repo.GetCollabByIdAsync(id);
        if (data == null) return Results.NotFound("Không tìm thấy dự án này.");
        return Results.Ok(data);
    } 
    catch (Exception ex) 
    {
        return Results.Problem($"Lỗi DB: {ex.Message}");
    }
});

// API Admin báo giá dự án
app.MapPost("/api/collab/{id:guid}/propose-price", async (Guid id, [FromBody] ProposePriceRequest req, CollabRepository repo) => {
    try 
    {
        // 1. Lấy trạng thái HIỆN TẠI của dự án từ Database
        var collab = await repo.GetCollabByIdAsync(id);
        if (collab == null) return Results.NotFound("Không tìm thấy dự án.");

        // 2. KHỞI TẠO CONTEXT (Nó sẽ tự biết phải dùng class RequestedState hay PriceProposedState)
        var context = new dotnet_collab.States.CollabContext(id, collab.Status, repo);

        // 3. THỰC HIỆN HÀNH ĐỘNG
        await context.ProposePriceAsync(req.Price, req.AdminNotes);

        return Results.Ok(new { message = "Báo giá thành công! Trạng thái đã chuyển sang PRICE_PROPOSED." });
    } 
    catch (InvalidOperationException ex) 
    {
        // Bắt lỗi từ State Pattern (ví dụ: Cố tình báo giá lần 2)
        return Results.BadRequest(new { error = ex.Message });
    }
    catch (Exception ex) 
    {
        return Results.Problem($"Lỗi hệ thống: {ex.Message}");
    }
});

// API 4: Khách hàng chốt giá (Client Action)
app.MapPost("/api/collab/{id:guid}/accept-price", async (Guid id, CollabRepository repo) => {
    try 
    {
        var collab = await repo.GetCollabByIdAsync(id);
        if (collab == null) return Results.NotFound("Không tìm thấy dự án.");

        var context = new CollabContext(id, collab.Status, repo);
        await context.AcceptPriceAsync();

        return Results.Ok(new { message = "Bạn đã chốt giá thành công! Đang chờ Admin bắt đầu dự án." });
    } 
    catch (InvalidOperationException ex) { return Results.BadRequest(new { error = ex.Message }); }
    catch (Exception ex) { return Results.Problem($"Lỗi hệ thống: {ex.Message}"); }
});

// API 5: Admin bắt đầu tiến hành dự án (Admin Action)
app.MapPost("/api/collab/{id:guid}/start", async (Guid id, CollabRepository repo) => {
    try 
    {
        var collab = await repo.GetCollabByIdAsync(id);
        if (collab == null) return Results.NotFound("Không tìm thấy dự án.");

        var context = new CollabContext(id, collab.Status, repo);
        await context.StartProgressAsync();

        return Results.Ok(new { message = "Dự án đã được bắt đầu! Ngày giờ (started_at) đã được hệ thống tự động ghi nhận." });
    } 
    catch (InvalidOperationException ex) { return Results.BadRequest(new { error = ex.Message }); }
    catch (Exception ex) { return Results.Problem($"Lỗi hệ thống: {ex.Message}"); }
});

// API 6: Hủy dự án
app.MapPost("/api/collab/{id:guid}/cancel", async (Guid id, CollabRepository repo) => {
    try 
    {
        var collab = await repo.GetCollabByIdAsync(id);
        if (collab == null) return Results.NotFound("Không tìm thấy dự án.");

        var context = new CollabContext(id, collab.Status, repo);
        await context.CancelAsync();

        return Results.Ok(new { message = "Dự án đã bị hủy." });
    } 
    catch (InvalidOperationException ex) { return Results.BadRequest(new { error = ex.Message }); }
    catch (Exception ex) { return Results.Problem($"Lỗi hệ thống: {ex.Message}"); }
});

//Test
app.MapGet("/api/collab/test", () => {
    return Results.Ok(new { message = "Tuyệt vời! Kết nối từ Node.js API Gateway đến C# Microservice đã thành công rực rỡ!" });
});
app.Run();

public record ProposePriceRequest(decimal Price, string AdminNotes);