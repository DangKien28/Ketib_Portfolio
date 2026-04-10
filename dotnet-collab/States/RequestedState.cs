using System;
using System.Threading.Tasks;

namespace dotnet_collab.States
{
    public class RequestedState : ICollabState
    {
        public string StatusName => "REQUESTED";
        public async Task Request_async(CollabContext context)
        {
            throw new InvalidOperationException("Yêu cầu hợp tác ĐÃ ĐƯỢC TẠO");
        }
        public async Task Accept_async(CollabContext context)
        {
            
        }
        public async Task Complete_async(CollabContext context)
        {
            throw new InvalidOperationException("Không thể hoàn thành khi dự án chưa được chấp nhận (ACCEPTED)");
        }
        public async Task Cancel_async(CollabContext context)
        {
            
        }
    }
}