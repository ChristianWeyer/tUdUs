using System.Threading;
using Microsoft.IdentityModel.Claims;

namespace Todo.Security
{
    public class GlobalClaimsAuthorizationManager : ClaimsAuthorizationManager
    {
        public override bool CheckAccess(AuthorizationContext context)
        {
            var principal = Thread.CurrentPrincipal as ClaimsPrincipal;
            
            if (principal != null)
            {
                var claimsId = principal.Identity as ClaimsIdentity;

                if (claimsId != null && claimsId.IsAuthenticated)
                {
                    // NOTE: Add custom logic here
                    return base.CheckAccess(context);
                }
            }

            return false;
        }
    }
}
