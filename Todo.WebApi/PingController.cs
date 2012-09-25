using System.Web.Http;
using Thinktecture.IdentityModel.Authorization.WebApi;

namespace Todo.WebApi
{
    [ApiAuthorize]
    public class PingController : ApiController
    {        
        public bool Get()
        {
            return true;
        }
    }
}