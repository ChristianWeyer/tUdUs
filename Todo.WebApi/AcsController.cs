using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IdentityModel.Protocols.WSTrust;
using System.IdentityModel.Selectors;
using System.IdentityModel.Services;
using System.IdentityModel.Services.Configuration;
using System.IdentityModel.Tokens;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using Thinktecture.IdentityModel.Clients.AccessControlService;
using Thinktecture.IdentityModel.Tokens;

namespace Todo.WebApi
{
    /// <summary>
    /// Controller for interacting with Windows Azure ACS via WS-Federation.
    /// </summary>
    [AllowAnonymous]
    public class AcsController : ApiController
    {
        /// <summary>
        /// Gets the IdP list from ACS.
        /// </summary>
        /// <param name="ns">The ACS namespace.</param>
        /// <param name="realm">The realm.</param>
        /// <returns></returns>
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

        /// <summary>
        /// Endpoint where ACS posts the token to.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public HttpResponseMessage Token()
        {
            var signInResponse = ExtractTokenResponse();
            var icp = ValidateToken(signInResponse);

            //var claimsTransformer = new AcsClaimsAuthenticationManager();
            //icp = claimsTransformer.Authenticate("acsToken", icp);
            
            var tokenExpiration = Convert.ToInt32(ConfigurationManager.AppSettings["acsTokenExpirationInMinutes"]);

            var newTokenString = CreateJwtToken(icp, tokenExpiration);
            var newTokenQueryString = BuildQueryStringFromToken(newTokenString, tokenExpiration);

            var redirectUrl = Url.Link("ACSApi", new { controller = "Acs", action = "Noop" });
            var newUrl = new Uri(redirectUrl + "?" + newTokenQueryString);

            var responseMessage = Request.CreateResponse(HttpStatusCode.Redirect);
            responseMessage.Headers.Location = newUrl;

            return responseMessage;
        }

        /// <summary>
        /// No-op action.
        /// </summary>
        /// <returns></returns>
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

        private static string CreateJwtToken(ClaimsPrincipal icp, int tokenExpiration)
        {
            var signingKey = ConfigurationManager.AppSettings["acsSigningKey"];
            

            var jwtHandler = new JsonWebTokenHandler();
            var securityDescriptor = new SecurityTokenDescriptor
            {
                Subject = icp.Identities.First(),
                SigningCredentials = new HmacSigningCredentials(signingKey),
                TokenIssuerName = ConfigurationManager.AppSettings["acsTokenIssuerName"],
                Lifetime = new Lifetime(DateTime.UtcNow, DateTime.UtcNow.AddMinutes(tokenExpiration)),
                AppliesToAddress = ConfigurationManager.AppSettings["acsAppliesToAddress"]
            };

            var jwtToken = jwtHandler.CreateToken(securityDescriptor);
            var newTokenString = jwtHandler.WriteToken(jwtToken);

            return newTokenString;
        }

        private ClaimsPrincipal ValidateToken(SignInResponseMessage signInResponse)
        {
            var serviceConfig = new FederationConfiguration();
            var fam = new WSFederationAuthenticationModule
                {
                    FederationConfiguration = serviceConfig
                };

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

        private ClaimsPrincipal ValidateToken(SecurityToken token)
        {
            var config = new SecurityTokenHandlerConfiguration();
            config.AudienceRestriction.AudienceMode = AudienceUriMode.Always;
            config.AudienceRestriction.AllowedAudienceUris.Add(new Uri(ConfigurationManager.AppSettings["acsAppliesToAddress"]));

            var registry = new ConfigurationBasedIssuerNameRegistry();
            registry.AddTrustedIssuer(ConfigurationManager.AppSettings["acsTrustedIssuerThumbprint"], "ACS");
            config.IssuerNameRegistry = registry;
            config.CertificateValidator = X509CertificateValidator.None;

            var handler = SecurityTokenHandlerCollection.CreateDefaultSecurityTokenHandlerCollection(config);
            var identity = handler.ValidateToken(token).First();

            return new ClaimsPrincipal(identity);
        }
    }
}