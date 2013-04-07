using System.Diagnostics;
using System.Web.Http;

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
        public void Post(dynamic logData)
        {
            // TODO: persist logging messages - consider using a JSON DB (MongoDB?)
            /* E.g. JSON structure:
                'logger',
                'timestamp',
                'level',
                'url',
                'message',
                'exception'
             */

            string msg = logData.message;
            Debug.WriteLine("###Log message from client: {0}", msg);
        }
    }
}