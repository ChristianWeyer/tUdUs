using Microsoft.IdentityModel.Claims;
using Microsoft.IdentityModel.Configuration;
using Microsoft.IdentityModel.Protocols.WSFederation;
using Microsoft.IdentityModel.Protocols.WSTrust;
using Microsoft.IdentityModel.Tokens;
using Microsoft.IdentityModel.Web;
using Newtonsoft.Json.Linq;
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
using Thinktecture.IdentityModel.Clients.AccessControlService;
using Thinktecture.IdentityModel.Tokens;
using Todo.Security;

namespace Todo.WebApi
{
    [AllowAnonymous]
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

            //var claimsTransformer = new AcsClaimsAuthenticationManager();
            //icp = claimsTransformer.Authenticate("acsToken", icp);
            
            var tokenExpiration = Convert.ToInt32(ConfigurationManager.AppSettings["tokenExpirationInMinutes"]);

            var newTokenString = CreateJwtToken(icp, tokenExpiration);
            var newTokenQueryString = BuildQueryStringFromToken(newTokenString, tokenExpiration);

            //NOTE: This returns null on .NET 4.0
            var redirectUrl = Url.Link("ACSApi", new { controller = "Acs", action = "Noop" });
            //var redirectUrl = "http://tttodos.azurewebsites.net/api/acs/noop";
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

        private static string BuildQueryStringFromToken(string newTokenString, int tokenExpiration)
        {
            var newTokenResponse = new TokenResponse
            {
                AccessToken = newTokenString,
                ExpiresIn = tokenExpiration,
                TokenType = "Bearer"
            };

            var newTokenObject = JObject.FromObject(newTokenResponse);
            var newTokenQueryString = String.Join("&",
                newTokenObject.Children().Cast<JProperty>()
                .Select(jp => jp.Name + "=" + HttpUtility.UrlEncode(jp.Value.ToString())));

            return newTokenQueryString;
        }

        private static string CreateJwtToken(IClaimsPrincipal icp, int tokenExpiration)
        {
            var signingKey = ConfigurationManager.AppSettings["signingKey"];
            

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
            config.AudienceRestriction.AllowedAudienceUris.Add(new Uri(ConfigurationManager.AppSettings["appliesToAddress"]));

            var registry = new ConfigurationBasedIssuerNameRegistry();
            registry.AddTrustedIssuer(ConfigurationManager.AppSettings["trustedIssuerThumbprint"], "ACS");
            config.IssuerNameRegistry = registry;
            config.CertificateValidator = X509CertificateValidator.None;

            var handler = SecurityTokenHandlerCollection.CreateDefaultSecurityTokenHandlerCollection(config);
            var identity = handler.ValidateToken(token).First();

            return ClaimsPrincipal.CreateFromIdentity(identity);
        }
    }
}