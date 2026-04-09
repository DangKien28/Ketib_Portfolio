using System.Threading.Tasks;
using dotnet_collab.DTOs;
using dotnet_collab.Mappers;
using dotnet_collab.Models;
using dotnet_collab.Repositories;
using dotnet_collab.States;

namespace dotnet_collab.Services
{
    public class CollabService
    {
        private ICollabRepository _repository;

        public CollabService(ICollabRepository repo)
        {
            _repository = repo;
        }

        public async Task<Collaboration_Response_DTO> CreateCollab_async(Collaboration_Request_DTO request_dto)
        {
            CollaborationModel new_collab = CollabMapper.DTO_To_Model(request_dto);
            CollabContext state_context = new CollabContext(new_collab.id, "REQUESTED", _repository);
            new_collab.status = state_context.CurrentStatusName;
            CollaborationModel save_collab = await _repository.Create_async(new_collab);
            Collaboration_Response_DTO response_dto = CollabMapper.Model_To_DTO(save_collab);
            return response_dto;
        }

        public async Task<Collaboration_Response_DTO> GetCollaborationById_async(Guid id)
        {
            CollaborationModel collab_model = await _repository.GetById_async(id);
            if (collab_model == null)
            {
                return null;
            }
            Collaboration_Response_DTO response_dto = CollabMapper.Model_To_DTO(collab_model);
            return response_dto;
        }

        public async Task<Collaboration_Response_DTO> AcceptCollaboration_async(Guid id)
        {
            CollaborationModel collab_model = await _repository.GetById_async(id);
            if (collab_model==null)
            {
                return null;
            }
            CollabContext state_context = new CollabContext(collab_model.id, collab_model.status, _repository);
            await state_context.Accept_async();

            collab_model.status = state_context.CurrentStatusName;
            collab_model.update_at = DateTime.UtcNow;
            
            Collaboration_Response_DTO response_dto = CollabMapper.Model_To_DTO(collab_model);
            return response_dto;
        }
    }
}