using System.Web.Http;

namespace Todo.WebApi
{
    /// <summary>
    /// Ping controller.
    /// </summary>
    public class PingController : ApiController
    {
        /// <summary>
        /// Dummy Get action.
        /// </summary>
        /// <returns></returns>
        public bool Get()
        {
            return true;
        }
    }
}