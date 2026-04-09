using System;
using System.Threading.Tasks;

namespace dotnet_collab.States
{
    public class RequestedState : ICollabState
    {
        public async Task Request_async(CollabContext context)
        {
            
        }
        public Task Accept_async(CollabContext context)
        {
            throw new InvalidOperationException("Chưa có báo giá, không thể đồng ý.");
        }
        public async Task Complete_async(CollabContext context)
        {
            
        }
        public async Task Cancel_async(CollabContext context)
        {
            // Lưu DB: Cập nhật trạng thái hủy
        }
    }
}