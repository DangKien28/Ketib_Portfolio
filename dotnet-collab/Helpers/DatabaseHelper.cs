//Hàm chứa kết nối giúp Repository không cần tự viết code kết nối trong mỗi hàm/chức năng
using Npgsql;

namespace dotnet_collab.Helpers
{
    public class DatabaseHelper
    {
        private string _connection_tring;
    
        public DatabaseHelper(IConfiguration configuration)
        {
            //Kết nối bằng IConfiguration
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

    }
}