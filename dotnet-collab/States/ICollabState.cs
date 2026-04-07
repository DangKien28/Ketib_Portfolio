using System.Threading.Tasks;

namespace dotnet_collab.States
{
    public interface ICollabState
    {
        // Admin đưa ra báo giá
        Task ProposePriceAsync(CollabContext context, decimal price, string admin_notes);
        
        // Khách hàng đồng ý mức giá
        Task AcceptPriceAsync(CollabContext context);
        
        // Chuyển sang trạng thái đang code
        Task StartProgressAsync(CollabContext context);
        
        // Hủy dự án
        Task CancelAsync(CollabContext context);
    }
}