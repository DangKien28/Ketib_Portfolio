using System;
using System.Threading.Tasks;

namespace dotnet_collab.States
{
    public class AcceptedState : ICollabState
    {
        public Task ProposePriceAsync(CollabContext context, decimal price, string adminNotes) => 
            throw new InvalidOperationException("Dự án đã chốt giá rồi, không thể báo giá lại.");
            
        public Task AcceptPriceAsync(CollabContext context) => 
            throw new InvalidOperationException("Bạn đã chốt giá thành công rồi, không cần thao tác lại.");

        public async Task StartProgressAsync(CollabContext context)
        {
            // Admin bấm bắt đầu làm -> Chuyển sang IN_PROGRESS 
            // (Database sẽ tự động lưu started_at nhờ Stored Procedure)
            await context.Repository.UpdateStatusAsync(context.CollabId, "IN_PROGRESS");
            Console.WriteLine($"Dự án {context.CollabId} đã chính thức khởi công!");
        }

        public async Task CancelAsync(CollabContext context)
        {
            await context.Repository.UpdateStatusAsync(context.CollabId, "CANCELLED");
        }
    }
}