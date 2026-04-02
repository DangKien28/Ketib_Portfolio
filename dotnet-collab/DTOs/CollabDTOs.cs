using System;
using System.ComponentModel.DataAnnotations;

namespace dotnet_collab.DTOs
{
    // 1. DTO dùng khi Khách hàng gửi yêu cầu tạo dự án (Không cho phép gửi Status hay Id)
public record CreateCollabRequestDto(
        
        [Required(ErrorMessage = "Tên dự án không được để trống")]
        [MinLength(3, ErrorMessage = "Tên dự án phải có ít nhất 3 ký tự")]
        string ProjectName,

        [Required(ErrorMessage = "Loại dự án không được để trống")]
        string ProjectType,

        [Required(ErrorMessage = "Email không được để trống")]
        [EmailAddress(ErrorMessage = "Email không đúng định dạng")]
        string ClientEmail,

        string? ClientNotes
    );

    // 2. DTO dùng khi trả dữ liệu về cho Khách hàng (Đã giấu đi AdminNotes và các thông tin nhạy cảm)
    public record CollabResponseDto(
        Guid Id,
        string ProjectName,
        string ProjectType,
        string Status,
        decimal? ProposedPrice,
        decimal? FinalCost,
        DateTime CreatedAt,
        DateTime? StartedAt
    );
}