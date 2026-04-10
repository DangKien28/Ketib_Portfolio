using System;
using System.Threading.Tasks;

namespace dotnet_collab.States
{
    public class AcceptedState : ICollabState
    {
        public string StatusName => "ACCEPTED";

        public Task Request_async(CollabContext context)
        {
            throw new InvalidOperationException("Dự án đang thực hiện, không thể quay lại trạng thái Yêu cầu.");
        }

        public Task Accept_async(CollabContext context)
        {
            throw new InvalidOperationException("Dự án ĐÃ ĐƯỢC CHẤP NHẬN trước đó.");
        }

        public Task Complete_async(CollabContext context)
        {
            // Hợp lệ: Chuyển sang Completed
            context.TransitionTo(new CompletedState());
            return Task.CompletedTask;
        }

        public Task Cancel_async(CollabContext context)
        {
            // Hợp lệ: Đang làm nhưng hủy ngang
            context.TransitionTo(new CancelledState());
            return Task.CompletedTask;
        }
    }
}