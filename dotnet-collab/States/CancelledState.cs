namespace dotnet_collab.States
{
    public class CancelledState : ICollabState
    {
        // Đã hủy thì khóa mọi thao tác
        public Task ProposePriceAsync(CollabContext context, decimal price, string adminNotes) => throw new InvalidOperationException("Dự án ĐÃ HỦY.");
        public Task AcceptPriceAsync(CollabContext context) => throw new InvalidOperationException("Dự án ĐÃ HỦY.");
        public Task StartProgressAsync(CollabContext context) => throw new InvalidOperationException("Dự án ĐÃ HỦY.");
        public Task CancelAsync(CollabContext context) => throw new InvalidOperationException("Dự án ĐÃ HỦY.");
    }
}