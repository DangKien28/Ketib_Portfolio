// File: States/CollabContext.cs
using System;
using System.Threading.Tasks;
using dotnet_collab.Models;
using dotnet_collab.Repositories;

namespace dotnet_collab.States
{
    public class CollabContext
    {
        public Guid CollabId { get; }
        public CollabRepository Repository { get; }
        
        // Trạng thái hiện tại
        private ICollabState _currentState;

        public CollabContext(Guid collabId, string initialStatus, CollabRepository repository)
        {
            CollabId = collabId;
            Repository = repository;
            // Khởi tạo trạng thái ban đầu dựa vào chuỗi status từ DB
            TransitionTo(GetStateFromName(initialStatus));
        }

        public void TransitionTo(ICollabState state)
        {
            _currentState = state;
        }

        // Các hàm gọi chuyển tiếp đến State hiện tại xử lý
        public Task ProposePriceAsync(decimal price, string adminNotes) => _currentState.ProposePriceAsync(this, price, adminNotes);
        public Task AcceptPriceAsync() => _currentState.AcceptPriceAsync(this);
        public Task StartProgressAsync() => _currentState.StartProgressAsync(this);
        public Task CancelAsync() => _currentState.CancelAsync(this);

        // Factory nhỏ để map từ chuỗi trong DB ra Class tương ứng
        private ICollabState GetStateFromName(string status)
        {
            return status switch
            {
                "REQUESTED" => new RequestedState(),
                "PRICE_PROPOSED" => new PriceProposedState(),
                "ACCEPTED" => new AcceptedState(), // SỬA DÒNG NÀY
                "IN_PROGRESS" => new InProgressState(),
                "CANCELLED" => throw new InvalidOperationException("Dự án đã bị hủy, không thể thao tác."),
                "COMPLETED" => throw new InvalidOperationException("Dự án đã hoàn thành, không thể thao tác."),
                _ => throw new Exception($"Trạng thái không hợp lệ: {status}")
            };
        }

        
    }
}