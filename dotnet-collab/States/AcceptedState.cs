namespace dotnet_collab.States
{
    public class AcceptedState : ICollabState
    {
        public Task ProposePriceAsync(CollabContext context, decimal price, string admin_note)
        {
            throw new InvalidOperationException("Đã chốt giá, không thể báo giá lại");
        }
        public Task AcceptPriceAsync(CollabContext context)
        {
            throw new InvalidOperationException("Hợp đồng đã chốt");
        }
        public async Task StartProgressAsync(CollabContext context)
        {
            // TODO: Lưu DB
            context.TransitionTo(new InProgressState());
        }
        public async Task CancelAsync(CollabContext context)
        {
            context.TransitionTo(new CancelledState());
        }
    }
}