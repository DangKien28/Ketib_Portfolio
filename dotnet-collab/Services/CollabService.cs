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
            CollabContext state_context = new CollabContext(new_collab.id, "REQUESTED");
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
            CollabContext state_context = new CollabContext(collab_model.id, collab_model.status);
            await state_context.Accept_async();

            string new_status = state_context.CurrentStatusName;
            DateTime current_time = DateTime.UtcNow;

            bool is_updated = await _repository.UpdateStatus_async(collab_model.id, new_status, current_time);

            if (!is_updated)
            {
                throw new InvalidOperationException("Không thể cập nhật trạng thái vào cơ sở dữ liệu.");
            }

            collab_model.status = new_status;
            collab_model.update_at = current_time;
            
            Collaboration_Response_DTO response_dto = CollabMapper.Model_To_DTO(collab_model);
            return response_dto;
        }

        public async Task<Collaboration_Response_DTO> CompleteCollaboration_async(Guid id)
        {
            CollaborationModel collab_model = await _repository.GetById_async(id);
            if (collab_model==null)
            {
                return null;
            }
            CollabContext state_context = new CollabContext(collab_model.id, collab_model.status);
            await state_context.Complete_async();

            string new_status = state_context.CurrentStatusName;
            DateTime current_time = DateTime.UtcNow;

            bool is_updated = await _repository.UpdateStatus_async(collab_model.id, new_status, current_time);

            if (!is_updated)
            {
                throw new InvalidOperationException("Không thể cập nhật trạng thái vào cơ sở dữ liệu.");
            }

            collab_model.status = new_status;
            collab_model.update_at = current_time;
            
            Collaboration_Response_DTO response_dto = CollabMapper.Model_To_DTO(collab_model);
            return response_dto;
        }

        public async Task<Collaboration_Response_DTO> CancelCollaboration_async(Guid id)
        {
            CollaborationModel collab_model = await _repository.GetById_async(id);
            if (collab_model==null)
            {
                return null;
            }
            CollabContext state_context = new CollabContext(collab_model.id, collab_model.status);
            await state_context.Cancel_async();

            string new_status = state_context.CurrentStatusName;
            DateTime current_time = DateTime.UtcNow;

            bool is_updated = await _repository.UpdateStatus_async(collab_model.id, new_status, current_time);

            if (!is_updated)
            {
                throw new InvalidOperationException("Không thể cập nhật trạng thái vào cơ sở dữ liệu.");
            }

            collab_model.status = new_status;
            collab_model.update_at = current_time;
            
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

        public async Task<Collaboration_Response_DTO> UpdateCollabPrice_async(Guid id, decimal price)
        {
            CollaborationModel collab_model = await _repository.GetById_async(id);
            if (collab_model==null) return null;
            if (collab_model.status == "CANCELLED" || collab_model.status == "COMPLETED")
            {
                throw new InvalidOperationException($"Không thể cập nhật giá cho dự án đang ở trạng thái {collab_model.status}.");
            }
            DateTime current_time = DateTime.UtcNow;
            bool is_updated = await _repository.UpdatePrice_async(collab_model.id, price, current_time);
            if (!is_updated) throw new InvalidOperationException("Lỗi khi cập nhật giá vào cơ sở dữ liệu.");

            collab_model.price = price;
            collab_model.update_at = current_time;
            Collaboration_Response_DTO response_dto = CollabMapper.Model_To_DTO(collab_model);
            return response_dto;
        }
    }
}