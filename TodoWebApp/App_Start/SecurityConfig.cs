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

            authNConfig.AddJsonWebToken(
                "TODOApi",
                "http://tt.com/mobile/todos",
                ConfigurationManager.AppSettings["signingKey"],
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