using System;
using System.Collections.Generic;
using System.Configuration;
using System.IdentityModel.Selectors;
using System.IdentityModel.Tokens;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using Microsoft.IdentityModel.Claims;
using Microsoft.IdentityModel.Configuration;
using Microsoft.IdentityModel.Protocols.WSFederation;
using Microsoft.IdentityModel.Protocols.WSTrust;
using Microsoft.IdentityModel.Tokens;
using Microsoft.IdentityModel.Web;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Thinktecture.IdentityModel.Clients.AccessControlService;
using Thinktecture.IdentityModel.Tokens;
using System.Net.Http.Headers;

namespace Todo.WebApi
{
    public class AcsController : ApiController
    {
        [HttpGet]
        public Task<List<IdentityProviderInformation>> GetIdps(string ns, string realm)
        {
            var disco = new IdentityProviderDiscoveryClient(ns, realm);
            return disco.GetAsync(Protocols.WSFederation).ContinueWith(task =>
            {
                var providerList = task.Result;

                return providerList;
            });
        }

        [HttpPost]
        public HttpResponseMessage Token()
        {
            var result = Request.Content.ReadAsFormDataAsync().Result;
            var data = result["wresult"];
            var response = new SignInResponseMessage(Request.RequestUri, data);

            var config = new ServiceConfiguration();
            var fam = new WSFederationAuthenticationModule();
            fam.ServiceConfiguration = config;

            var token = fam.GetSecurityToken(response);
            var icp = ValidateToken(token);

            // transform claims
            // TODO...

            var key = ConfigurationManager.AppSettings["signingKey"];
            var expiration = 24; //hours

            var jwtHandler = new JsonWebTokenHandler();
            var descriptor = new SecurityTokenDescriptor
            {
                Subject = icp.Identities.First(),
                SigningCredentials = new HmacSigningCredentials(key),
                TokenIssuerName = "TODOApi",
                Lifetime = new Lifetime(DateTime.UtcNow, DateTime.UtcNow.AddHours(expiration)),
                AppliesToAddress = "http://tt.com/mobile/todos"
            };

            var jwtToken = jwtHandler.CreateToken(descriptor);
            var tokenString = jwtHandler.WriteToken(jwtToken);

            var tokenResponse = new TokenResponse
            {
                AccessToken = tokenString,
                ExpiresIn = expiration * 60,
                TokenType = "Bearer"
            };

            var jo = JObject.FromObject(tokenResponse);
            var  joString = jo.ToString();

            // TODO: add as resource
            var js =
                @"<!DOCTYPE html>
                <html>
                <head>     
                <title>Processing...</title>
                    <script src=""../../app/js/jquery-1.7.1.min.js"" type=""text/javascript""></script>
                    <script src=""../../app/js/amplify.min.js"" type=""text/javascript""></script>
                    <script type=""text/javascript"">
                        var tokenResponse = {TOKEN};

                        $(function () {
                            //window.opener.acsViewModel.setToken(tokenResponse);
                            //window.close();
                            amplify.store.sessionStorage(""tokenResponse"", tokenResponse);
                        });
                    </script>                    
                </head>
                <body><h3>Processing...</h3></body>
                </html>";
            
            js = js.Replace("{TOKEN}", joString);
            
            var responseMessage  = Request.CreateResponse();
            responseMessage.Content = new StringContent(js);
            responseMessage.Content.Headers.ContentType = new MediaTypeHeaderValue("text/html");

            return responseMessage;
        }

        private IClaimsPrincipal ValidateToken(SecurityToken token)
        {
            var config = new SecurityTokenHandlerConfiguration();
            config.AudienceRestriction.AudienceMode = AudienceUriMode.Always;
            config.AudienceRestriction.AllowedAudienceUris.Add(new Uri("http://tt.com/mobile/todos"));

            var registry = new ConfigurationBasedIssuerNameRegistry();
            registry.AddTrustedIssuer("9243CE072FCD94A422ABDC9A2055769369E20CF3", "ACS");
            config.IssuerNameRegistry = registry;
            config.CertificateValidator = X509CertificateValidator.None;

            var handler = SecurityTokenHandlerCollection.CreateDefaultSecurityTokenHandlerCollection(config);
            var identity = handler.ValidateToken(token).First();

            return ClaimsPrincipal.CreateFromIdentity(identity);
        }

    }

    public class TokenResponse
    {
        [JsonProperty(PropertyName = "access_token")]
        public string AccessToken { get; set; }

        [JsonProperty(PropertyName = "token_type")]
        public string TokenType { get; set; }

        [JsonProperty(PropertyName = "expires_in")]
        public int ExpiresIn { get; set; }

        [JsonProperty(PropertyName = "refresh_token")]
        public string RefreshToken { get; set; }
    }

}