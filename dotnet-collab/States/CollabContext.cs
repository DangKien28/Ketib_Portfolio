using dotnet_collab.Repositories;

namespace dotnet_collab.States
{
    public class CollabContext
    {
        public Guid CollabId {get;}
        private ICollabState _currentState;
        public string CurrentStatusName => _currentState.StatusName;
        public CollabContext(Guid collab_id, string initial_status)
        {
            CollabId = collab_id;
            TransitionTo(GetStateFromName(initial_status));
        }

        public void TransitionTo(ICollabState state)
        {
            _currentState = state;
        }

        public Task Request_async()
        {
            return _currentState.Request_async(this);
        }
        public Task Accept_async()
        {
            return _currentState.Accept_async(this);
        }

        public Task Complete_async()
        {
            return _currentState.Complete_async(this);
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