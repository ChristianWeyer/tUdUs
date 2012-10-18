using System.Security.Claims;

namespace Todo.Security
{
    public class GlobalClaimsAuthenticationManager : ClaimsAuthenticationManager
    {
        public override ClaimsPrincipal Authenticate(string resourceName, ClaimsPrincipal incomingPrincipal)
        {            
            return base.Authenticate(resourceName, incomingPrincipal);
        }
    }
}
