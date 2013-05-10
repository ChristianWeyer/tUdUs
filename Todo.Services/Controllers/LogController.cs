using Serilog;
using System.Web.Http;

namespace Todo.Services
{
    /// <summary>
    /// Simple controller for receiving logging messages
    /// </summary>
    [AllowAnonymous] // Consider one strongly typed action for anon; dynamic action for authenticated only
    public class LogController : ApiController
    {
        /// <summary>
        /// Post specified log data.
        /// </summary>
        /// <param name="logData">The log data.</param>
        public void Post(LogData logData)
        {
            Log.Information("tUdUs: {@LogData}", logData); // NOTE: does not yet really work...
        }

        ///// <summary>
        ///// Post specified log data (dynamic version).
        ///// </summary>
        ///// <param name="logData">The log data.</param>
        //public void Post(dynamic logData)
        //{
        //    Log.Logger = new LoggerConfiguration()
        //        .WriteTo.Console()
        //        .WriteTo.MongoDB("mongodb://localhost/todoslogs")
        //        .CreateLogger();

        //    Log.Information("tUdUs: {@LogData}", logData); // NOTE: does not yet really work...

        //    string msg = logData.message;
        //    Debug.WriteLine("###Log message from client: {0}", msg);
        //}
    }

    public class LogData
    {
        public string Logger { get; set; }
        public string Timestamp { get; set; }
        public string Level { get; set; }
        public string Url { get; set; }
        public string Message { get; set; }
        public string Exception { get; set; }
    }
}