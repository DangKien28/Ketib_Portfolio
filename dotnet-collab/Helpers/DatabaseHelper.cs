//Hàm chứa kết nối giúp Repository không cần tự viết code kết nối trong mỗi hàm/chức năng
using DotNetEnv;
using Npgsql;
using System;
using System.Data;

namespace dotnet_collab.Helpers
{
    public class DatabaseHelper
    {
        private string? _connection_tring;
    
        public DatabaseHelper(IConfiguration configuration)
        {
            _connection_tring = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING")
            ?? throw new ArgumentNullException("DB_CONNECTION_STRING không tồn tại trong file .env.");
        }
        public string GetConnectionString()
        {
            return _connection_tring;
        }

        public NpgsqlConnection CreateConnection()
        {
            return new NpgsqlConnection(_connection_tring);
        }

    }
}