namespace dotnet_collab.States
{
    public class CompletedState : ICollabState
    {
        public string StatusName => "COMPLETED";
        public async Task Request_async(CollabContext context)
        {
            
        }
        public async Task Accept_async(CollabContext context)
        {
            
        }
        public async Task Complete_async(CollabContext context)
        {
            
        }
        public async Task Cancel_async(CollabContext context)
        {
            
        }
    }
}