

using Microsoft.Data.Sqlite;
using Newtonsoft.Json;
using System.Data;
using System.Xml;
using Formatting = Newtonsoft.Json.Formatting;

namespace api.services.Handlers
{
    public class SqliteHandler
    {
        public static string ConnectionString = string.Empty;

        public static string GetJson(string request) 
        { 
            return JsonConvert.SerializeObject(GetDt(request), Formatting.Indented);
        }

        public static DataTable GetDt(string query)
        {
            string response = string.Empty;
            DataTable dt = new DataTable();
            SqliteConnection cnn = new SqliteConnection(ConnectionString);

            cnn.Open();

            SqliteCommand mycommand = new SqliteCommand(query, cnn);
            mycommand.CommandText = query;
            SqliteDataReader reader = mycommand.ExecuteReader();
            dt.Load(reader);

            reader.Close();
            cnn.Close();

            return dt;
        }

        public static bool Exec(string query) 
        {
            bool response = false;
            SqliteConnection Conn = new SqliteConnection(ConnectionString);//faltaba esto, por eso tiraba error.
            SqliteCommand Command = new SqliteCommand(query,Conn);
            Conn.Open();

            try 
            {
                Command.ExecuteNonQuery();
                response = true;
            }
            catch 
            {
                response = false;
            }

            Conn.Close();

            return response;
        }

    }
}
