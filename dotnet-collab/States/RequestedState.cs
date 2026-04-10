using System;
using System.Threading.Tasks;

namespace dotnet_collab.States
{
    public class RequestedState : ICollabState
    {
        public string StatusName => "REQUESTED";

        public Task Request_async(CollabContext context)
        {
            throw new InvalidOperationException("Yêu cầu hợp tác ĐÃ ĐƯỢC TẠO, không thể tạo lại.");
        }

        public Task Accept_async(CollabContext context)
        {
            // Hợp lệ: Chuyển sang Accepted
            context.TransitionTo(new AcceptedState());
            return Task.CompletedTask;
        }

        public Task Complete_async(CollabContext context)
        {
            throw new InvalidOperationException("Không thể hoàn thành khi dự án chưa được chấp nhận (ACCEPTED).");
        }

        public Task Cancel_async(CollabContext context)
        {
            // Hợp lệ: Chuyển sang Cancelled
            context.TransitionTo(new CancelledState());
            return Task.CompletedTask;
        }
    }
}