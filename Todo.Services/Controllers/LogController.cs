using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Dynamic;
using System.Web.Http;
using MongoDB.Driver;
using Simple.Data;
using Simple.Data.MongoDB;

namespace Todo.Services
{
    /// <summary>
    /// Simple controller for receiving logging messages
    /// </summary>
    [AllowAnonymous]
    public class LogController : ApiController
    {
        /// <summary>
        /// Post specified log data.
        /// </summary>
        /// <param name="logData">The log data.</param>
        public void Post(LogData logData)
        {
            // TODO: persist logging messages - consider EF code-first
            Debug.WriteLine("###Log message from client: {0}", logData.Message);
        }

        ///// <summary>
        ///// Post specified log data (dynamic version).
        ///// </summary>
        ///// <param name="logData">The log data.</param>
        //public void Post(dynamic logData)
        //{
        //    // TODO: persist logging messages - consider using a JSON DB (MongoDB?)
        //    /* E.g. JSON structure:
        //        'logger',
        //        'timestamp',
        //        'level',
        //        'url',
        //        'message',
        //        'exception'
        //     */

        //    try
        //    {
        //        var db = DatabaseHelper.Open();
        //        db.Logs.Insert(logData); // does not work; either further investigate - or wait for dynamic support in official MongoDB driver 2.0
        //    }
        //    catch (Exception)
        //    {
        //        // NOTE: swallow intentionally for the demo app
        //        //throw;
        //    }

        //    string msg = logData.message;
        //    Debug.WriteLine("###Log message from client: {0}", msg);
        //}

        //internal static class DatabaseHelper
        //{
        //    public static dynamic Open()
        //    {
        //        return Database.Opener.OpenMongo("mongodb://localhost/todosLogging?safe=true");
        //    }
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