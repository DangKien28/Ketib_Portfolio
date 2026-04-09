namespace dotnet_collab.States
{
    public class InProgressState : ICollabState
    {
        public Task ProposePriceAsync(CollabContext context, decimal price, string adminNotes) => throw new InvalidOperationException("Dự án đang làm, không thể đổi giá.");
        public Task AcceptPriceAsync(CollabContext context) => throw new InvalidOperationException("Dự án đang làm.");
        public Task StartProgressAsync(CollabContext context) => throw new InvalidOperationException("Dự án đã bắt đầu rồi.");
        public async Task CancelAsync(CollabContext context) => context.TransitionTo(new CancelledState()); 
    }
}