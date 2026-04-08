using System.Data;
using dotnet_collab.Helpers;
using dotnet_collab.Models;
using Npgsql;

namespace dotnet_collab.Repositories
{
    public class CollabRepository : ICollabRepository
    {
        private DatabaseHelper _db_helper;
        public CollabRepository(DatabaseHelper db_helper)
        {
            _db_helper = db_helper;
        }
        public async Task<CollaborationModel> GetById_async(Guid id)
        {
            NpgsqlConnection connection = _db_helper.CreateConnection();

            try
            {
                await connection.OpenAsync();

                NpgsqlCommand command = new NpgsqlCommand("sp_get_collab_by_id", connection);

                try
                {
                    command.CommandType = CommandType.StoredProcedure;
                    
                    // SỬA LỖI 3: Map đúng tên tham số p_collab_id như trong DB script
                    command.Parameters.AddWithValue("p_collab_id", id); 

                    NpgsqlDataReader reader = await command.ExecuteReaderAsync();

                    try
                    {
                        if (await reader.ReadAsync())
                        {
                            return new CollaborationModel
                            {
                                id = reader.GetGuid(reader.GetOrdinal("id")),
                                project_name = reader.GetString(reader.GetOrdinal("project_name")),
                                project_type = reader.GetString(reader.GetOrdinal("project_type")),
                                client_email = reader.GetString(reader.GetOrdinal("client_email")),
                        
                                client_notes = reader.IsDBNull(reader.GetOrdinal("client_notes")) ? null : reader.GetString(reader.GetOrdinal("client_notes")),
                                proposed_price = reader.IsDBNull(reader.GetOrdinal("proposed_price")) ? null : reader.GetDecimal(reader.GetOrdinal("proposed_price")),
                                final_cost = reader.IsDBNull(reader.GetOrdinal("final_cost")) ? null : reader.GetDecimal(reader.GetOrdinal("final_cost")),
                        
                                status = reader.GetString(reader.GetOrdinal("status")),
                                admin_notes = reader.IsDBNull(reader.GetOrdinal("admin_notes")) ? null : reader.GetString(reader.GetOrdinal("admin_notes")),
                        
                                create_at = reader.GetDateTime(reader.GetOrdinal("created_at")),
                                start_at = reader.IsDBNull(reader.GetOrdinal("started_at")) ? null : reader.GetDateTime(reader.GetOrdinal("started_at")),
                                update_at = reader.IsDBNull(reader.GetOrdinal("updated_at")) ? null : reader.GetDateTime(reader.GetOrdinal("updated_at"))
                            };
                        }
                    }
                    finally
                    {
                        if (reader != null)
                        {
                            await reader.DisposeAsync();
                        }
                    }
                }
                finally
                {
                    if (command != null)
                    {
                        command.Dispose();
                    }
                }
            }
            finally
            {
                if (connection != null)
                {
                    connection.Dispose();
                }
            }
            return null;
        }

        public async Task<CollaborationModel> Create_async(CollaborationModel collab_model)
        {
            NpgsqlConnection connection = _db_helper.CreateConnection();

            try
            {
                await connection.OpenAsync();
                NpgsqlCommand command = new NpgsqlCommand("sp_create_collab_request", connection);

                try
                {
                    command.CommandType = CommandType.StoredProcedure;

                    // SỬA LỖI 1 & 3: Thêm tiền tố p_ để khớp 100% với file SQL đã viết
                    command.Parameters.AddWithValue("p_id", collab_model.id);
                    command.Parameters.AddWithValue("p_project_name", collab_model.project_name);
                    command.Parameters.AddWithValue("p_project_type", collab_model.project_type);
                    command.Parameters.AddWithValue("p_client_email", collab_model.client_email);
                    
                    // Xử lý an toàn nếu client_notes bị null
                    command.Parameters.AddWithValue("p_client_notes", string.IsNullOrEmpty(collab_model.client_notes) ? DBNull.Value : (object)collab_model.client_notes);
                    
                    command.Parameters.AddWithValue("p_status", collab_model.status);
                    command.Parameters.AddWithValue("p_created_at", collab_model.create_at);

                    await command.ExecuteNonQueryAsync();

                }
                finally
                {
                    if (command != null)
                    {
                        command.Dispose();
                    }
                }
            }
            finally
            {
                if (connection != null)
                {
                    connection.Dispose();
                }
            }
            return collab_model;
        }

        public async Task<bool> UpdateCollabStatus_async(Guid collab_id, string new_status, decimal? proposed_price = null, string admin_note = null)
        {
            NpgsqlConnection connection = _db_helper.CreateConnection();
            try
            {
                await connection.OpenAsync();
                // Dựa trên file SQL cập nhật ở bước trước, SP của Update gọi là sp_admin_propose_price hoặc sp_update_collab_status tùy bạn đặt
                // Tôi giữ nguyên tên SP của bạn là "sp_update_collab_status"
                NpgsqlCommand command = new NpgsqlCommand("sp_update_collab_status", connection);

                try
                {
                    command.CommandType = CommandType.StoredProcedure;

                    // SỬA LỖI 3: Đồng nhất tiền tố p_ cho tham số
                    command.Parameters.AddWithValue("p_id", collab_id);
                    command.Parameters.AddWithValue("p_status", new_status);
                    command.Parameters.AddWithValue("p_proposed_price", proposed_price.HasValue ? (object)proposed_price.Value : DBNull.Value);
                    command.Parameters.AddWithValue("p_admin_notes", string.IsNullOrEmpty(admin_note) ? DBNull.Value : (object)admin_note);
                    
                    // Truyền thêm updated_at để DB biết thời điểm update (Bắt buộc theo CSDL mới)
                    command.Parameters.AddWithValue("p_updated_at", DateTime.UtcNow);

                    int rows_affected = await command.ExecuteNonQueryAsync();
                    return rows_affected > 0;
                }
                finally
                {
                    if (command != null)
                    {
                        command.Dispose();
                    }
                }
            }
            finally
            {
                if (connection != null)
                {
                    connection.Dispose();
                }
            }
        }
    }
}