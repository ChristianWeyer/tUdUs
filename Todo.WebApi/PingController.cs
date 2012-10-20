using System.Web.Http;

namespace Todo.WebApi
{
    public class PingController : ApiController
    {        
        public bool Get()
        {
            return true;
        }
    }
}