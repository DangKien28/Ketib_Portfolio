using dotnet_collab.DTOs;
using dotnet_collab.Models;

namespace dotnet_collab.Mappers
{
    public static class CollabMapper
    {
        public static CollaborationModel DTO_To_Model(Collaboration_Request_DTO dto)
        {
            CollaborationModel model = new CollaborationModel();
            model.id = Guid.NewGuid();
            model.project_name = dto.project_name;
            model.project_type = dto.project_type;
            model.client_email = dto.client_email;
            model.client_notes = dto.client_notes;
            model.status = "Requested";
            model.create_at = DateTime.UtcNow;

            return model;
        }

        public static Collaboration_Response_DTO Model_To_DTO(CollaborationModel model)
        {
            Collaboration_Response_DTO dto = new Collaboration_Response_DTO();
            dto.id = model.id;
            dto.project_name = model.project_name;
            dto.project_type = model.project_type;
            dto.status = model.status;
            dto.proposed_price = model.proposed_price;
            dto.final_cost = model.final_cost;
            dto.create_at = model.create_at;

            return dto;
        }
    }
}