using System.Threading.Tasks;

namespace dotnet_collab.States
{
    public interface ICollabState
    {
        Task Request_async(CollabContext context);
        Task Accept_async(CollabContext context);
        Task Complete_async(CollabContext context);
        Task Cancel_async(CollabContext context);
    }
}