// File: States/PriceProposedState.cs
using System;
using System.Threading.Tasks;

namespace dotnet_collab.States
{
    public class PriceProposedState : ICollabState
    {
        public Task ProposePriceAsync(CollabContext context, decimal price, string adminNotes)
        {
            throw new InvalidOperationException("Dự án đã được báo giá rồi, đang chờ khách hàng phản hồi.");
        }

        public async Task AcceptPriceAsync(CollabContext context)
        {
            // Khách đồng ý -> Chuyển trạng thái DB sang ACCEPTED
            await context.Repository.UpdateStatusAsync(context.CollabId, "ACCEPTED");
            Console.WriteLine($"Khách hàng đã chốt giá cho dự án {context.CollabId}");
        }

        public Task StartProgressAsync(CollabContext context) 
        {
            throw new InvalidOperationException("Khách hàng chưa chốt, không thể bắt đầu làm việc.");
        }

        public async Task CancelAsync(CollabContext context)
        {
            await context.Repository.UpdateStatusAsync(context.CollabId, "CANCELLED");
        }
    }
}