using System.Threading;
using Microsoft.IdentityModel.Claims;

namespace Todo.Security
{
    public class GlobalClaimsAuthorizationManager : ClaimsAuthorizationManager
    {
        public override bool CheckAccess(AuthorizationContext context)
        {
            var principal = Thread.CurrentPrincipal as ClaimsPrincipal;
            var claimsId = principal.Identity as ClaimsIdentity;

            if (claimsId.IsAuthenticated)
            {
                return base.CheckAccess(context);
            }
            else
            {
                return false;
            }
        }
    }
}
