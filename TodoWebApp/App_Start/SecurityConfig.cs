using System.IdentityModel.Services;
using System.Web.Http;
using Thinktecture.IdentityModel.Authorization.WebApi;
using Thinktecture.IdentityModel.Tokens.Http;
using System.Configuration;

namespace Todo.WebApp.App_Start
{
    public class SecurityConfig
    {
        public static void Configure(HttpConfiguration config)
        {
            var authNConfig = new AuthenticationConfiguration
                {
                    DefaultAuthenticationScheme = "Basic",
                    SendWwwAuthenticateResponseHeader = false
                };

            //authNConfig.AddJsonWebToken(
            //    "TODOApi",
            //    "http://tt.com/mobile/todos",
            //    ConfigurationManager.AppSettings["acsSigningKey"],
            //    AuthenticationOptions.ForAuthorizationHeader("Bearer"));

            authNConfig.AddJsonWebToken(
                "http://identityserver.v2.thinktecture.com/trust/changethis",
                "http://tt.com/mobile/todos",
                ConfigurationManager.AppSettings["oauthSigningKey"],
                AuthenticationOptions.ForAuthorizationHeader("Bearer"));

            authNConfig.AddBasicAuthentication(
                (un, pw) => un == pw); // this is the super complex basic authentication validation logic :)

            authNConfig.ClaimsAuthenticationManager =
                FederatedAuthentication.FederationConfiguration
                    .IdentityConfiguration.ClaimsAuthenticationManager;

            config.MessageHandlers.Add(new AuthenticationHandler(authNConfig));
            config.Filters.Add(new ClaimsAuthorizeAttribute());
        }
    }
}