namespace dotnet_collab.States
{
    public class CancelledState : ICollabState
    {
        public string StatusName => "CANCELED";
        // Đã hủy thì khóa mọi thao tác
        public Task Request_async(CollabContext context) => throw new InvalidOperationException("Dự án ĐÃ HỦY.");
        public Task Accept_async(CollabContext context) => throw new InvalidOperationException("Dự án ĐÃ HỦY.");
        public Task Complete_async(CollabContext context) => throw new InvalidOperationException("Dự án ĐÃ HỦY.");
        public Task Cancel_async(CollabContext context) => throw new InvalidOperationException("Dự án ĐÃ HỦY.");
    }
}