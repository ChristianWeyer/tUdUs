using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;
using Thinktecture.IdentityModel.Clients.AccessControlService;

namespace Todo.WebApi
{
    public class AcsController : ApiController
    {
        [HttpGet]
        public Task<List<IdentityProviderInformation>> GetIdps(string ns, string realm)
        {
            var disco = new IdentityProviderDiscoveryClient(ns, realm);
            return disco.GetAsync(Protocols.JavaScriptNotify).ContinueWith(task =>
            {
                var providerList = task.Result;

                return providerList;
            });         
        }

        [HttpPost]
        public void Token()
        {
            var result = Request.Content.ReadAsStringAsync().Result;
        }
    }
}