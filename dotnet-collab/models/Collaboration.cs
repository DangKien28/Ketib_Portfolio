using System;
namespace dotnet_collab.Models
{
    public class CollaborationModel
    {
        public Guid id {get; set; }
        public string project_name {get; set;} = string.Empty;
        public string project_type {get; set; } = string.Empty;
        public string client_email {get; set; } = string.Empty;
        public string? client_notes {get; set; }
        public decimal? price {get; set; }
        public string status {get; set; } = "Requested";
        public DateTime create_at {get; set; }
        public DateTime? start_at {get; set; }
        public DateTime? update_at {get; set; }
    }
}