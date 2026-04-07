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

        public Task ProposePrice_async(decimal price, string admin_note)
        {
            return _currentState.ProposePriceAsync(this, price, admin_note);
        }
        public Task AcceptPrice_async()
        {
            return _currentState.AcceptPriceAsync(this);
        }
        public Task StartProgress_async()
        {
            return _currentState.StartProgressAsync(this);
        }
        public Task Cancel_async()
        {
            return _currentState.CancelAsync(this);
        }

        private ICollabState GetStateFromName(string status)
        {
            switch (status.ToUpper())
            {
                case "REQUESTED":
                    return new RequestedState();
                case "PRICE_PROPOSED":
                    return new PriceProposedState();
                case "ACCEPTED":
                    return new AcceptedState();
                case "IN_PROGRESS":
                    return new InProgressState();
                case "CANCELLED":
                    return new CancelledState();
                default:
                    throw new ArgumentException($"Không nhận diện được trạng thái");
            }
        }
    }
}