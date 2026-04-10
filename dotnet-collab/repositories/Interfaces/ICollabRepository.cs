using dotnet_collab.Models;

namespace dotnet_collab.Repositories
{
    public interface ICollabRepository
    {
        Task<CollaborationModel> GetById_async(Guid id);
        Task<CollaborationModel> Create_async(CollaborationModel collaboration);
        Task<bool> UpdateStatus_async(Guid id, string new_status, DateTime update_at);
        Task<bool> UpdateToAccepted_async(Guid id, string new_status, DateTime start_at);
        Task<List<CollaborationModel>> GetAllCollabs_async();
        Task<List<CollaborationModel>> GetAllCollabsByUserId_async(Guid user_id);
        Task<bool> UpdatePrice_async(Guid id, decimal price, DateTime update_at);
    }
}