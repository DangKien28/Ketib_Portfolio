// File: States/InProgressState.cs
using System;
using System.Threading.Tasks;

namespace dotnet_collab.States
{
    public class InProgressState : ICollabState
    {
        public Task ProposePriceAsync(CollabContext context, decimal price, string adminNotes) => 
            throw new InvalidOperationException("Dự án ĐANG LÀM, không thể báo giá lại.");
            
        public Task AcceptPriceAsync(CollabContext context) => 
            throw new InvalidOperationException("Đã chốt giá từ trước rồi.");
            
        public Task StartProgressAsync(CollabContext context) => 
            throw new InvalidOperationException("Dự án ĐÃ VÀ ĐANG thực hiện rồi.");

        public async Task CancelAsync(CollabContext context)
        {
            // Tạm thời cho phép hủy khi đang làm (thực tế có thể cần đền bù hợp đồng)
            await context.Repository.UpdateStatusAsync(context.CollabId, "CANCELLED");
        }
    }
}