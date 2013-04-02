using System.Threading;
using System.Web.Http;

namespace Todo.Services.UiClaims
{
    /// <summary>
    /// Controller for requesting view claims
    /// </summary>
    //[AllowAnonymous]
    public class UiClaimsController : ApiController
    {
        private readonly UiClaimsServiceAuthorizationManager authorizationManager = new UiClaimsAuthorizationManager();

        [HttpGet]
        public UiClaimsData Claims()
        {
            return authorizationManager.GetUiClaims(Thread.CurrentPrincipal);
        }

        [HttpGet]
        public UiClaimsMetadata Metadata()
        {
            return authorizationManager.GetUiClaimsMetadata();
        }
    }
}