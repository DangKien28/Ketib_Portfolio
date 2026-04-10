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

        public async Task<Collaboration_Response_DTO> CreateCollab_async(Collaboration_Request_DTO request_dto, Guid user_id)
        {
            CollaborationModel new_collab = CollabMapper.DTO_To_Model(request_dto, user_id);
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

        public async Task<List<Collaboration_Response_DTO>> GetAllCollaborations_async()
        {
            List<CollaborationModel> collabs_model_list = await _repository.GetAllCollabs_async();
            List<Collaboration_Response_DTO> response_list = new List<Collaboration_Response_DTO>();
            
            if (collabs_model_list != null)
            {
                foreach (CollaborationModel model in collabs_model_list)
                {
                    response_list.Add(CollabMapper.Model_To_DTO(model));
                }
            }
            return response_list;
        }

        public async Task<List<Collaboration_Response_DTO>> GetAllCollabsByUserId_async(Guid id)
        {
            List<CollaborationModel> collab_models = await _repository.GetAllCollabsByUserId_async(id);
            List<Collaboration_Response_DTO> response_list = new List<Collaboration_Response_DTO>();
            if (collab_models != null && collab_models.Any())
            {
                foreach (var model in collab_models)
                {
                    response_list.Add(CollabMapper.Model_To_DTO(model));
                }
            }
            return response_list;
        }
    }
}