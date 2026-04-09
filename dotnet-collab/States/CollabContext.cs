using dotnet_collab.Repositories;

namespace dotnet_collab.States
{
    public class CollabContext
    {
        public Guid CollabId {get;}
        public ICollabRepository Repository {get;} 
        private ICollabState _currentState;
        public CollabContext(Guid collab_id, string initial_status, ICollabRepository repo)
        {
            CollabId = collab_id;
            Repository = repo;
            TransitionTo(GetStateFromName(initial_status));
        }

        public void TransitionTo(ICollabState state)
        {
            _currentState = state;
        }

        public Task AcceptPrice_async()
        {
            return _currentState.Accept_async(this);
        }

        public Task Cancel_async()
        {
            return _currentState.Cancel_async(this);
        }

        private ICollabState GetStateFromName(string status)
        {
            switch (status.ToUpper())
            {
                case "REQUESTED":
                    return new RequestedState();
                case "ACCEPTED":
                    return new AcceptedState();
                case "CANCELLED":
                    return new CancelledState();
                case "COMPLETE":
                    return new CompletedState();
                default:
                    throw new ArgumentException($"Không nhận diện được trạng thái");
            }
        }
    }
}