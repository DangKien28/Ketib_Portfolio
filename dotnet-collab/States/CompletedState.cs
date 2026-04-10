using System;
using System.Threading.Tasks;

namespace dotnet_collab.States
{
    public class CompletedState : ICollabState
    {
        public string StatusName => "COMPLETED";

        // Khi đã hoàn thành thì khóa mọi thao tác thay đổi trạng thái khác
        public Task Request_async(CollabContext context) => throw new InvalidOperationException("Dự án đã HOÀN THÀNH.");
        public Task Accept_async(CollabContext context) => throw new InvalidOperationException("Dự án đã HOÀN THÀNH.");
        public Task Complete_async(CollabContext context) => throw new InvalidOperationException("Dự án đã HOÀN THÀNH.");
        public Task Cancel_async(CollabContext context) => throw new InvalidOperationException("Không thể hủy một dự án đã HOÀN THÀNH.");
    }
}