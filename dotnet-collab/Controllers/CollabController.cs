using dotnet_collab.DTOs;
using dotnet_collab.Services;
using Microsoft.AspNetCore.Mvc;

namespace dotnet_collab.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CollabController : ControllerBase
    {
        private CollabService _collabService;
        public CollabController(CollabService collab_service)
        {
            _collabService = collab_service;
        }

        [HttpPost]
        public async Task<IActionResult> CreateCollaboration([FromBody] Collaboration_Request_DTO request_dto)
        {
            try
            {
                if (!Request.Headers.TryGetValue("X-User-Id", out var userIdString) || !Guid.TryParse(userIdString, out Guid userId))
                {
            // Nếu không có header này hoặc định dạng không phải UUID (Guid), từ chối luôn
                    return Unauthorized(new { message = "Không xác định được danh tính người dùng (Missing or invalid X-User-Id)" });
                }
                Collaboration_Response_DTO response_dto = await _collabService.CreateCollab_async(request_dto, userId);
                return CreatedAtAction(nameof(GetCollaborationById), new {id = response_dto.id}, response_dto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new {message = "Lỗi nội bộ khi tạo yêu cầu hợp tác", error = ex.Message});
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCollaborationById(Guid id)
        {
            try
            {
                Collaboration_Response_DTO response_dto = await _collabService.GetCollaborationById_async(id);
                if (response_dto == null)
                {
                    return NotFound(new {message = $"KHông tìm thấy yêu cầu hợp tác với ID: {id}"});
                }
                return Ok(response_dto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new {message = "Lỗi máy chủ nội bộ khi truy xuất dữ liệu", error = ex.Message});
            }
        }

        [HttpPatch("{id}/accept")]
        public async Task<IActionResult> AcceptCollaboration(Guid id)
        {
            try
            {
                Collaboration_Response_DTO response_dto = await _collabService.AcceptCollaboration_async(id);
                if (response_dto==null)
                {
                    return NotFound(new {message="$Không tìm thấy yêu cầu có ID ${id}"});
                }
                return Ok(response_dto);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new {message = "Không thể thay đổi trạng thái", error = ex.Message});
            }
            catch (Exception ex)
            {
                return StatusCode(500, new {message = "Lỗi máy chủ nội bộ khi cập nhật trạng thái", error = ex.Message});
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCollaborations()
        {
            try
            {
                List<Collaboration_Response_DTO> response_list = await _collabService.GetAllCollaborations_async();
                return Ok(response_list);
            }
            catch (Exception e)
            {
                return StatusCode(500, new {message="Lỗi khi lấy danh sách", error = e.Message});
            }
        }

        [HttpGet("my-collabs")]
        public async Task<IActionResult> GetMyCollabs()
        {
            try
            {
                if (!Request.Headers.TryGetValue("X-User-Id", out var userIdString) ||!Guid.TryParse(userIdString, out Guid userId))
                {
                    return Unauthorized(new { message = "Không xác định được danh tính người dùng (Missing or invalid X-User-Id)" });
                }
                List<Collaboration_Response_DTO> response_list = await _collabService.GetAllCollabsByUserId_async(userId);
                return Ok(response_list);
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = "Lỗi nội bộ khi lấy danh sách hợp tác", error = e.Message });
            }
        }
    }
}