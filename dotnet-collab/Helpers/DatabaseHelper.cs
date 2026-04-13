//Hàm chứa kết nối giúp Repository không cần tự viết code kết nối trong mỗi hàm/chức năng
using Npgsql;

namespace dotnet_collab.Helpers
{
    public class DatabaseHelper
    {
        private string _connection_tring;
    
        public DatabaseHelper(IConfiguration configuration)
        {
            // Đọc chuỗi kết nối an toàn từ IConfiguration (từ Environment Variables do Docker truyền vào hoặc từ User Secrets)
            _connection_tring = configuration.GetConnectionString("PostgresConnection")
            ?? throw new ArgumentNullException("Chuỗi kết nối 'PostgresConnection' không tồn tại");
        }

        public string GetConnectionString()
        {
            return _connection_tring;
        }

        public NpgsqlConnection CreateConnection()
        {
            return new NpgsqlConnection(_connection_tring);
        }

        // 1. Hàm thực thi các câu lệnh không trả về dữ liệu (INSERT, UPDATE, DELETE)
        public async Task<int> ExecuteNonQueryAsync(string query, Dictionary<string, object>? parameters = null, CommandType commandType = CommandType.Text)
        {
            await using var connection = CreateConnection();
            await connection.OpenAsync();
            
            await using var command = new NpgsqlCommand(query, connection) { CommandType = commandType };
            AddParameters(command, parameters);

            return await command.ExecuteNonQueryAsync();
        }

        // 2. Hàm lấy ID/Giá trị duy nhất (Ví dụ: SELECT COUNT(*), INSERT ... RETURNING id)
        public async Task<object?> ExecuteScalarAsync(string query, Dictionary<string, object>? parameters = null, CommandType commandType = CommandType.Text)
        {
            await using var connection = CreateConnection();
            await connection.OpenAsync();
            
            await using var command = new NpgsqlCommand(query, connection) { CommandType = commandType };
            AddParameters(command, parameters);

            return await command.ExecuteScalarAsync();
        }

        // 3. Hàm truy vấn dữ liệu dạng List (SELECT)
        public async Task<List<T>> GetDataAsync<T>(string query, Func<NpgsqlDataReader, T> mapFunction, Dictionary<string, object>? parameters = null, CommandType commandType = CommandType.Text)
        {
            var results = new List<T>();

            await using var connection = CreateConnection();
            await connection.OpenAsync();
            
            await using var command = new NpgsqlCommand(query, connection) { CommandType = commandType };
            AddParameters(command, parameters);

            await using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                results.Add(mapFunction(reader));
            }

            return results;
        }

        // Hàm phụ trợ gán Parameters an toàn chống SQL Injection
        private void AddParameters(NpgsqlCommand command, Dictionary<string, object>? parameters)
        {
            if (parameters != null)
            {
                foreach (var param in parameters)
                {
                    // Tránh lỗi khi truyền null vào CSDL
                    command.Parameters.AddWithValue(param.Key, param.Value ?? DBNull.Value);
                }
            }
        }
    }
}