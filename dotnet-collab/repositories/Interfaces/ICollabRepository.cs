using dotnet_collab.Models;

namespace dotnet_collab.Repositories
{
    public interface ICollabRepository
    {
        Task<CollaborationModel> GetById_async(Guid id);
        Task<CollaborationModel> Create_async(CollaborationModel collaboration);
        Task<bool> UpdateCollabStatus_async(Guid collabId, string newStatus, decimal? proposedPrice = null, string adminNotes = null);
    }
}