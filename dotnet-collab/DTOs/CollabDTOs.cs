namespace dotnet_collab.DTOs
{
    public class Collaboration_Request_DTO
    {
        public string project_name {get; set; }
        public string project_type {get; set; }
        public string client_email {get; set; }
        public string client_notes {get; set; }
    }

    //Hiển thị trên frontend
    public class Collaboration_Response_DTO
    {
        public Guid id {get; set; }
        public string project_name {get; set; }
        public string project_type {get; set; }
        public string status {get; set; }
        public decimal? proposed_price {get; set; }
        public decimal? final_cost {get; set; }
        public DateTime create_at {get; set; }
    }
}