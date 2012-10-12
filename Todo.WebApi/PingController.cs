using System.Web.Http;
using Thinktecture.IdentityModel.Authorization.WebApi;

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