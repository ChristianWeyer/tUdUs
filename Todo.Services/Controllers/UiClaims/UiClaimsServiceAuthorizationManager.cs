using System.Security.Claims;
using System.Security.Principal;

namespace Todo.Services.UiClaims
{
    public abstract class UiClaimsServiceAuthorizationManager : ClaimsAuthorizationManager
    {
        public abstract UiClaimsData GetUiClaims(IPrincipal principal);
        public abstract UiClaimsMetadata GetUiClaimsMetadata();
    }
}
