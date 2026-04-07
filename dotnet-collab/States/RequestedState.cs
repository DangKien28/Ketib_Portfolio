namespace dotnet_collab.States
{
    public class RequestedState : ICollabState
    {
        public async Task ProposePriceAsync(CollabContext context, decimal price, string admin_note)
        {
            // TODO: Sẽ gọi context.Repository.Update... để lưu xuống DB ở đây
            context.TransitionTo(new PriceProposedState());
        }
        public Task AcceptPriceAsync(CollabContext context)
        {
            throw new InvalidOperationException("Chưa có báo giá, không thể đồng ý.");
        }

        public Task StartProgressAsync(CollabContext context)
        {
            throw new InvalidOperationException("Chưa chốt giá, không thể bắt đầu.");
        }
        public async Task CancelAsync(CollabContext context)
        {
            // TODO: Lưu DB
            context.TransitionTo(new CancelledState());
        }
    }
}