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

        // Tách hàm Mapping chung để không lặp lại code
        private CollaborationModel MapToCollaborationModel(NpgsqlDataReader reader)
        {
            return new CollaborationModel
            {
                id = reader.GetGuid(reader.GetOrdinal("id")),
                user_id = reader.GetGuid(reader.GetOrdinal("user_id")),
                project_name = reader.GetString(reader.GetOrdinal("project_name")),
                project_type = reader.GetString(reader.GetOrdinal("project_type")),
                client_email = reader.GetString(reader.GetOrdinal("client_email")),
                client_notes = reader.IsDBNull(reader.GetOrdinal("client_notes")) ? null : reader.GetString(reader.GetOrdinal("client_notes")),
                price = reader.IsDBNull(reader.GetOrdinal("price")) ? null : reader.GetDecimal(reader.GetOrdinal("price")),
                status = reader.GetString(reader.GetOrdinal("status")),
                create_at = reader.GetDateTime(reader.GetOrdinal("created_at")),
                start_at = reader.IsDBNull(reader.GetOrdinal("started_at")) ? null : reader.GetDateTime(reader.GetOrdinal("started_at")),
                update_at = reader.IsDBNull(reader.GetOrdinal("updated_at")) ? null : reader.GetDateTime(reader.GetOrdinal("updated_at"))
            };
        }

        public async Task<CollaborationModel> GetById_async(Guid id)
        {
            var parameters = new Dictionary<string, object> { { "p_collab_id", id } };
            var results = await _db_helper.GetDataAsync("sp_get_collab_by_id", MapToCollaborationModel, parameters, CommandType.StoredProcedure);
            return results.FirstOrDefault();
        }

        public async Task<CollaborationModel> Create_async(CollaborationModel collab_model)
        {
            var parameters = new Dictionary<string, object>
            {
                { "p_id", collab_model.id },
                { "p_user_id", collab_model.user_id },
                { "p_project_name", collab_model.project_name },
                { "p_project_type", collab_model.project_type },
                { "p_client_email", collab_model.client_email },
                { "p_client_notes", collab_model.client_notes ?? (object)DBNull.Value },
                { "p_status", collab_model.status },
                { "p_created_at", collab_model.create_at }
            };

            await _db_helper.ExecuteNonQueryAsync("sp_create_collab_request", parameters, CommandType.StoredProcedure);
            return collab_model;
        }

        public async Task<bool> UpdateStatus_async(Guid id, string new_status, DateTime update_at)
        {
            var parameters = new Dictionary<string, object>
            {
                { "p_id", id },
                { "p_status", new_status },
                { "p_update_at", update_at }
            };
            int rows_affected = await _db_helper.ExecuteNonQueryAsync("sp_update_collab_status", parameters, CommandType.StoredProcedure);
            return rows_affected > 0;
        }

        public async Task<List<CollaborationModel>> GetAllCollabs_async()
        {
            return await _db_helper.GetDataAsync("sp_get_all_collabs", MapToCollaborationModel, null, CommandType.StoredProcedure);
        }

        public async Task<List<CollaborationModel>> GetAllCollabsByUserId_async(Guid user_id)
        {
            var parameters = new Dictionary<string, object> { { "p_user_id", user_id } };
            return await _db_helper.GetDataAsync("sp_get_collabs_by_user_id", MapToCollaborationModel, parameters, CommandType.StoredProcedure);
        }

        public async Task<bool> UpdatePrice_async(Guid id, decimal price, DateTime update_at)
        {
            var parameters = new Dictionary<string, object>
            {
                { "p_id", id },
                { "p_price", price },
                { "p_update_at", update_at }
            };
            int rows_affected = await _db_helper.ExecuteNonQueryAsync("sp_update_collab_price", parameters, CommandType.StoredProcedure);
            return rows_affected > 0;
        }

        public async Task<bool> UpdateToAccepted_async(Guid id, string new_status, DateTime start_at)
        {
            var parameters = new Dictionary<string, object>
            {
                { "p_id", id },
                { "p_status", new_status },
                { "p_start_at", start_at }
            };
            int rows_affected = await _db_helper.ExecuteNonQueryAsync("sp_update_collab_to_accepted", parameters, CommandType.StoredProcedure);
            return rows_affected > 0;
        }

        public async Task<bool> UpdateCollabInfo_async(CollaborationModel model)
        {
            var parameters = new Dictionary<string, object>
            {
                { "p_id", model.id },
                { "p_project_name", model.project_name },
                { "p_project_type", model.project_type },
                { "p_client_email", model.client_email },
                { "p_client_notes", model.client_notes ?? (object)DBNull.Value },
                { "p_update_at", model.update_at ?? DateTime.UtcNow }
            };
            int rows_affected = await _db_helper.ExecuteNonQueryAsync("sp_update_collab_info", parameters, CommandType.StoredProcedure);
            return rows_affected > 0;
        }

        public async Task<bool> DeleteCollab_async(Guid id)
        {
            var parameters = new Dictionary<string, object> { { "p_id", id } };
            int rows_affected = await _db_helper.ExecuteNonQueryAsync("sp_delete_collab", parameters, CommandType.StoredProcedure);
            return rows_affected > 0;
        }
    }
}