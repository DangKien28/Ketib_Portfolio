// File: Program.cs
using DotNetEnv;
using Microsoft.AspNetCore.Mvc;
using dotnet_collab.Models;
using dotnet_collab.Repositories;
using dotnet_collab.States;
using dotnet_collab.DTOs; // QUAN TRỌNG: Thêm namespace DTOs vào đây

Env.Load("../.env");

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddScoped<CollabRepository>();
var app = builder.Build();

// ====================================================================
// API 1: TẠO MỚI YÊU CẦU (Nhận DTO -> Chuyển thành Model -> Lưu DB)
// ====================================================================
app.MapPost("/api/collab/create", async ([FromBody] CreateCollabRequestDto requestDto, CollabRepository repo) => {
    try 
    {
        // 1. Mapping: Trích xuất dữ liệu an toàn từ DTO sang Model
        var newCollab = new Collaboration
        {
            ProjectName = requestDto.ProjectName,
            ProjectType = requestDto.ProjectType,
            ClientEmail = requestDto.ClientEmail,
            ClientNotes = requestDto.ClientNotes
            // Các trường nhạy cảm như Status, AdminNotes... sẽ bị bỏ qua, an toàn tuyệt đối!
        };

        // 2. Đưa Model cho Repository xử lý
        var newId = await repo.CreateCollabAsync(newCollab);
        return Results.Ok(new { message = "Tạo thành công!", id = newId });
    } 
    catch (Exception ex) 
    {
        return Results.Problem($"Lỗi DB: {ex.Message}");
    }
});

// ====================================================================
// API 2: LẤY CHI TIẾT DỰ ÁN (Lấy Model -> Chuyển thành DTO -> Trả Client)
// ====================================================================
app.MapGet("/api/collab/{id:guid}", async (Guid id, CollabRepository repo) => {
    try 
    {
        // 1. Lấy Model thô từ Database (chứa tất cả dữ liệu)
        var collabModel = await repo.GetCollabByIdAsync(id);
        if (collabModel == null) return Results.NotFound("Không tìm thấy dự án này.");

        // 2. Mapping: Bốc dữ liệu từ Model sang DTO (giấu đi AdminNotes)
        var responseDto = new CollabResponseDto(
            collabModel.Id,
            collabModel.ProjectName,
            collabModel.ProjectType,
            collabModel.Status,
            collabModel.ProposedPrice,
            collabModel.FinalCost,
            collabModel.CreatedAt,
            collabModel.StartedAt
        );

        // 3. Trả DTO cho Khách hàng
        return Results.Ok(responseDto);
    } 
    catch (Exception ex) 
    {
        return Results.Problem($"Lỗi DB: {ex.Message}");
    }
});

// ====================================================================
// API 3: ADMIN BÁO GIÁ (Đã dùng record ProposePriceRequest làm DTO)
// ====================================================================
app.MapPost("/api/collab/{id:guid}/propose-price", async (Guid id, [FromBody] ProposePriceRequest req, CollabRepository repo) => {
    try 
    {
        var collab = await repo.GetCollabByIdAsync(id);
        if (collab == null) return Results.NotFound("Không tìm thấy dự án.");

        var context = new CollabContext(id, collab.Status, repo);
        await context.ProposePriceAsync(req.Price, req.AdminNotes);

        return Results.Ok(new { message = "Báo giá thành công! Trạng thái đã chuyển sang PRICE_PROPOSED." });
    } 
    catch (InvalidOperationException ex) { return Results.BadRequest(new { error = ex.Message }); }
    catch (Exception ex) { return Results.Problem($"Lỗi hệ thống: {ex.Message}"); }
});

// ====================================================================
// CÁC API CÒN LẠI GIỮ NGUYÊN (Vì chỉ nhận Action, không nhận/trả object phức tạp)
// ====================================================================

// API 4: Khách hàng chốt giá
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

// API 5: Admin bắt đầu tiến hành dự án
app.MapPost("/api/collab/{id:guid}/start", async (Guid id, CollabRepository repo) => {
    try 
    {
        var collab = await repo.GetCollabByIdAsync(id);
        if (collab == null) return Results.NotFound("Không tìm thấy dự án.");

        var context = new CollabContext(id, collab.Status, repo);
        await context.StartProgressAsync();

        return Results.Ok(new { message = "Dự án đã được bắt đầu!" });
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

// Test API
app.MapGet("/api/collab/test", () => {
    return Results.Ok(new { message = "Tuyệt vời! Kết nối từ Node.js API Gateway đến C# Microservice đã thành công rực rỡ!" });
});

app.Run();

// DTO phụ dùng riêng cho việc Báo giá
public record ProposePriceRequest(decimal Price, string AdminNotes);