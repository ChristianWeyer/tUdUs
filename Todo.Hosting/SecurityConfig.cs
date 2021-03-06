﻿using System.Configuration;
using System.IdentityModel.Services;
using System.Web.Http;
using Thinktecture.IdentityModel.Authorization.WebApi;
using Thinktecture.IdentityModel.Tokens.Http;

namespace Todo.Hosting
{
    public class SecurityConfig
    {
        public static void Register(HttpConfiguration config)
        {
            var authNConfig = new AuthenticationConfiguration
                {
                    SendWwwAuthenticateResponseHeaders = false,
                    RequireSsl = false
                };

            //authNConfig.AddJsonWebToken(
            //    "TODOApi",
            //    "http://tt.com/mobile/todos",
            //    ConfigurationManager.AppSettings["acsSigningKey"]);

            authNConfig.AddJsonWebToken(
                "http://identityserver.v2.thinktecture.com/trust/cw",
                "http://tt.com/mobile/todos",
                ConfigurationManager.AppSettings["oauthSigningKey"]);

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