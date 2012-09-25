using Microsoft.IdentityModel.Claims;

namespace Todo.Security
{
    public class GlobalClaimsAuthenticationManager : ClaimsAuthenticationManager
    {
        public override IClaimsPrincipal Authenticate(string resourceName, IClaimsPrincipal incomingPrincipal)
        {
            // TODO: get data from database for populating claims...
            // And think about caching!

            return base.Authenticate(resourceName, incomingPrincipal);
        }
    }
}
