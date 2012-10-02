using System;
using System.Collections.Generic;
using System.Configuration;
using System.IdentityModel.Selectors;
using System.IdentityModel.Tokens;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using Microsoft.IdentityModel.Claims;
using Microsoft.IdentityModel.Configuration;
using Microsoft.IdentityModel.Protocols.WSFederation;
using Microsoft.IdentityModel.Protocols.WSTrust;
using Microsoft.IdentityModel.Tokens;
using Microsoft.IdentityModel.Web;
using Newtonsoft.Json.Linq;
using Thinktecture.IdentityModel.Clients.AccessControlService;
using Thinktecture.IdentityModel.Tokens;

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
            var signInResponse = ExtractTokenResponse();
            var icp = ValidateToken(signInResponse);

            // TODO: Optionally transform claims

            int tokenExpiration;
            var newTokenString = CreateJwtToken(icp, out tokenExpiration);

            var newTokenQueryString = BuildQueryStringFromToken(tokenExpiration, newTokenString);

            //TODO: This returns null on my machine - seems very strange...
            //var redirectUrl = Url.Link("ACSApi", new { controller = "Acs", action = "Noop" });

            var redirectUrl = "http://tttodos.azurewebsites.net/api/acs/noop";
            var newUrl = new Uri(redirectUrl + "?" + newTokenQueryString);

            var responseMessage = Request.CreateResponse(HttpStatusCode.Redirect);
            responseMessage.Headers.Location = newUrl;

            return responseMessage;
        }

        [HttpGet]
        public HttpResponseMessage Noop()
        {
            var response = Request.CreateResponse();
            response.StatusCode = HttpStatusCode.OK;

            return response;
        }

        private static string BuildQueryStringFromToken(int tokenExpiration, string newTokenString)
        {
            var newTokenResponse = new TokenResponse
            {
                AccessToken = newTokenString,
                ExpiresIn = tokenExpiration * 60,
                TokenType = "Bearer"
            };

            var newTokenObject = JObject.FromObject(newTokenResponse);
            var newTokenQueryString = String.Join("&",
                newTokenObject.Children().Cast<JProperty>()
                .Select(jp => jp.Name + "=" + HttpUtility.UrlEncode(jp.Value.ToString())));

            return newTokenQueryString;
        }

        private static string CreateJwtToken(IClaimsPrincipal icp, out int tokenExpiration)
        {
            var signingKey = ConfigurationManager.AppSettings["signingKey"];
            tokenExpiration = Convert.ToInt32(ConfigurationManager.AppSettings["tokenExpirationInMinutes"]);

            var jwtHandler = new JsonWebTokenHandler();
            var securityDescriptor = new SecurityTokenDescriptor
            {
                Subject = icp.Identities.First(),
                SigningCredentials = new HmacSigningCredentials(signingKey),
                TokenIssuerName = ConfigurationManager.AppSettings["tokenIssuerName"],
                Lifetime = new Lifetime(DateTime.UtcNow, DateTime.UtcNow.AddMinutes(tokenExpiration)),
                AppliesToAddress = ConfigurationManager.AppSettings["appliesToAddress"]
            };

            var jwtToken = jwtHandler.CreateToken(securityDescriptor);
            var newTokenString = jwtHandler.WriteToken(jwtToken);

            return newTokenString;
        }

        private IClaimsPrincipal ValidateToken(SignInResponseMessage signInResponse)
        {
            var serviceConfig = new ServiceConfiguration();
            var fam = new WSFederationAuthenticationModule();
            fam.ServiceConfiguration = serviceConfig;

            var tokenFromAcs = fam.GetSecurityToken(signInResponse);
            var icp = ValidateToken(tokenFromAcs);

            return icp;
        }

        private SignInResponseMessage ExtractTokenResponse()
        {
            var formResult = Request.Content.ReadAsFormDataAsync().Result;
            var wresult = formResult["wresult"];
            var signInResponse = new SignInResponseMessage(Request.RequestUri, wresult);

            return signInResponse;
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
}