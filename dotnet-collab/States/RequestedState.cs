// File: States/RequestedState.cs
using System;
using System.Threading.Tasks;

namespace dotnet_collab.States
{
    public class RequestedState : ICollabState
    {
        public async Task ProposePriceAsync(CollabContext context, decimal price, string adminNotes)
        {
            // 1. Gọi Repository để update DB (chạy SP sp_admin_propose_price)
            await context.Repository.AdminProposePriceAsync(context.CollabId, price, adminNotes);
            
            // 2. Chuyển ngữ cảnh sang trạng thái tiếp theo
            // context.TransitionTo(new PriceProposedState()); // (Sẽ tạo class này sau)
            
            Console.WriteLine($"Đã báo giá {price} cho dự án {context.CollabId}");
        }

        public Task AcceptPriceAsync(CollabContext context) => throw new InvalidOperationException("Chưa có báo giá, không thể chấp nhận.");
        public Task StartProgressAsync(CollabContext context) => throw new InvalidOperationException("Chưa chốt giá, không thể bắt đầu làm.");
        
        public async Task CancelAsync(CollabContext context)
        {
            // Cho phép hủy khi vừa mới request
            await context.Repository.UpdateStatusAsync(context.CollabId, "CANCELLED");
            // context.TransitionTo(new CancelledState());
        }
    }
}