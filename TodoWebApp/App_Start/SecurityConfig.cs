﻿using System.Web.Http;
using Thinktecture.IdentityModel.Authorization.WebApi;
using Thinktecture.IdentityModel.Tokens.Http;
using Todo.Security;
using System.Configuration;

namespace Todo.WebApp.App_Start
{
    public class SecurityConfig
    {
        public static void Configure(HttpConfiguration config)
        {
            var authNConfig = new AuthenticationConfiguration();
            authNConfig.DefaultAuthenticationScheme = "Basic";
            authNConfig.SendWwwAuthenticateResponseHeader = false;

            authNConfig.AddJsonWebToken(
                "TODOApi",
                "http://tt.com/mobile/todos", 
                ConfigurationManager.AppSettings["signingKey"], 
                AuthenticationOptions.ForAuthorizationHeader("Bearer"));

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