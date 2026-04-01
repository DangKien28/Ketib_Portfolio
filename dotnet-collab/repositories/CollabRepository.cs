// File: Repositories/CollabRepository.cs
using System;
using System.Data;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Npgsql;
using dotnet_collab.Models;

namespace dotnet_collab.Repositories
{
    public class CollabRepository
    {
        private readonly string _connectionString;

        public CollabRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("PostgresConnection") 
                                ?? throw new Exception("Không tìm thấy chuỗi kết nối Database.");
        }

        // 1. Gọi Function tạo mới yêu cầu (Insert)
        // Ánh xạ với hàm: sp_create_collab_request
        public async Task<Guid> CreateCollabAsync(Collaboration collab)
        {
            await using var conn = new NpgsqlConnection(_connectionString);
            await conn.OpenAsync();

            // SỬA Ở ĐÂY: Dùng câu lệnh SELECT để gọi Function và truyền tham số bằng @
            var sql = "SELECT sp_create_collab_request(@p_project_name, @p_project_type, @p_client_email, @p_client_notes)";
            await using var cmd = new NpgsqlCommand(sql, conn);
            
            // LƯU Ý: KHÔNG dùng cmd.CommandType = CommandType.StoredProcedure; nữa

            cmd.Parameters.AddWithValue("@p_project_name", collab.ProjectName);
            cmd.Parameters.AddWithValue("@p_project_type", collab.ProjectType);
            cmd.Parameters.AddWithValue("@p_client_email", collab.ClientEmail);
            cmd.Parameters.AddWithValue("@p_client_notes", (object?)collab.ClientNotes ?? DBNull.Value);

            var result = await cmd.ExecuteScalarAsync();
            return (Guid)result!;
        }

        // 2. Gọi Function lấy dữ liệu chi tiết (Select)
        // Ánh xạ với hàm: sp_get_collab_by_id
        public async Task<Collaboration?> GetCollabByIdAsync(Guid collabId)
        {
            await using var conn = new NpgsqlConnection(_connectionString);
            await conn.OpenAsync();

            // SỬA Ở ĐÂY: Dùng SELECT * FROM để lấy bảng dữ liệu từ Function trả về
            var sql = "SELECT * FROM sp_get_collab_by_id(@p_collab_id)";
            await using var cmd = new NpgsqlCommand(sql, conn);

            cmd.Parameters.AddWithValue("@p_collab_id", collabId);

            await using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new Collaboration
                {
                    Id = reader.GetGuid(reader.GetOrdinal("id")),
                    ProjectName = reader.GetString(reader.GetOrdinal("project_name")),
                    ProjectType = reader.GetString(reader.GetOrdinal("project_type")),
                    ClientEmail = reader.GetString(reader.GetOrdinal("client_email")),
                    ClientNotes = reader.IsDBNull(reader.GetOrdinal("client_notes")) ? null : reader.GetString(reader.GetOrdinal("client_notes")),
                    ProposedPrice = reader.IsDBNull(reader.GetOrdinal("proposed_price")) ? null : reader.GetDecimal(reader.GetOrdinal("proposed_price")),
                    FinalCost = reader.IsDBNull(reader.GetOrdinal("final_cost")) ? null : reader.GetDecimal(reader.GetOrdinal("final_cost")),
                    Status = reader.GetString(reader.GetOrdinal("status")),
                    CreatedAt = reader.GetDateTime(reader.GetOrdinal("created_at")),
                    StartedAt = reader.IsDBNull(reader.GetOrdinal("started_at")) ? null : reader.GetDateTime(reader.GetOrdinal("started_at"))
                };
            }
            return null;
        }

        // 3. Admin: Đề xuất giá và ghi chú
        // Ánh xạ với hàm: sp_admin_propose_price
        public async Task AdminProposePriceAsync(Guid collabId, decimal proposedPrice, string? adminNotes)
        {
            await using var conn = new NpgsqlConnection(_connectionString);
            await conn.OpenAsync();

            // Dùng SELECT để gọi Function trả về VOID trong PostgreSQL
            var sql = "SELECT sp_admin_propose_price(@p_collab_id, @p_proposed_price, @p_admin_notes)";
            await using var cmd = new NpgsqlCommand(sql, conn);

            cmd.Parameters.AddWithValue("@p_collab_id", collabId);
            cmd.Parameters.AddWithValue("@p_proposed_price", proposedPrice);
            cmd.Parameters.AddWithValue("@p_admin_notes", (object?)adminNotes ?? DBNull.Value);

            // ExecuteNonQueryAsync dùng cho các lệnh không cần đọc dữ liệu trả về (INSERT, UPDATE, DELETE, VOID)
            await cmd.ExecuteNonQueryAsync();
        }

        // 4. Cập nhật trạng thái dự án (Có tự động ghi nhận started_at nếu là IN_PROGRESS)
        // Ánh xạ với hàm: sp_update_collab_status
        public async Task UpdateStatusAsync(Guid collabId, string newStatus)
        {
            await using var conn = new NpgsqlConnection(_connectionString);
            await conn.OpenAsync();

            var sql = "SELECT sp_update_collab_status(@p_collab_id, @p_new_status)";
            await using var cmd = new NpgsqlCommand(sql, conn);

            cmd.Parameters.AddWithValue("@p_collab_id", collabId);
            cmd.Parameters.AddWithValue("@p_new_status", newStatus);

            await cmd.ExecuteNonQueryAsync();
        }
    }
}