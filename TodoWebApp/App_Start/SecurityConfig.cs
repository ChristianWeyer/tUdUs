using System.Web.Http;
using Thinktecture.IdentityModel.Authorization.WebApi;
using Thinktecture.IdentityModel.Tokens.Http;
using Todo.Security;

namespace Todo.WebApp
{
    public class SecurityConfig
    {
        public static void Configure(HttpConfiguration config)
        {
            var authNConfig = new AuthenticationConfiguration();
            authNConfig.DefaultAuthenticationScheme = "Basic";
            authNConfig.SendWwwAuthenticateResponseHeader = false;

            authNConfig.AddBasicAuthentication(
                (un, pw) => un == pw); // this is the super complex basic authentication validation logic :)

            authNConfig.ClaimsAuthenticationManager =
                new GlobalClaimsAuthenticationManager();
            config.SetAuthorizationManager(new HttpClaimsAuthorizationManager(
                new GlobalClaimsAuthorizationManager()));

            config.MessageHandlers.Add(new AuthenticationHandler(authNConfig));
        }
    }
}