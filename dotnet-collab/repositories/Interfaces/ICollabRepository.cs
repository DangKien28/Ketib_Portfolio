using dotnet_collab.Models;

namespace dotnet_collab.Repositories
{
    public interface ICollabRepository
    {
        Task<CollaborationModel> GetById_async(Guid id);
        Task<CollaborationModel> Create_async(CollaborationModel collaboration);
    }
}