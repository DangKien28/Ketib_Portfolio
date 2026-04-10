using System.ComponentModel.DataAnnotations;
namespace dotnet_collab.DTOs
{
    public class Collaboration_Request_DTO
    {
        [Required(ErrorMessage = "Tên dự án không được để trống")]
        [StringLength(255)]
        public string project_name {get; set; }

        [Required(ErrorMessage = "Loại dự án không được để trống")]
        public string project_type {get; set; }

        [Required(ErrorMessage = "Email không được để trống")]
        [EmailAddress(ErrorMessage = "Email không đúng định dạng")]
        public string client_email {get; set; }
        public string? client_notes {get; set; }
    }

    //Hiển thị trên frontend
    public class Collaboration_Response_DTO
    {
        public Guid id {get; set; }
        public string? project_name {get; set; }
        public string? project_type {get; set; }
        public string? status {get; set; }
        public decimal? price {get; set; }
        public DateTime create_at {get; set; }
        public DateTime? start_at {get; set; }
    }

    public class Collab_ProposePrice_DTO
    {
        public Guid id {get; set;}
        public decimal? price {get; set;}
    }
}