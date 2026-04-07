namespace dotnet_collab.States
{
    public class PriceProposedState : ICollabState
    {
        public async Task ProposePriceAsync(CollabContext context, decimal price, string admin_note)
        {
            // TODO: Lưu DB
        }
        public async Task AcceptPriceAsync(CollabContext context)
        {
            // TODO: Lưu DB
            context.TransitionTo(new AcceptedState());
        }
        public Task StartProgressAsync(CollabContext context)
        {
            throw new InvalidOperationException("Khách chưa đồng ý giá, không thể bắt đầu.");
        }
        public async Task CancelAsync(CollabContext context)
        {
            context.TransitionTo(new CancelledState());
        }
    }
}