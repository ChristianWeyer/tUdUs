using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Security.Principal;
using Thinktecture.IdentityModel.Authorization;

namespace Todo.Services.UiClaims
{
    public class UiClaimsAuthorizationManager : UiClaimsServiceAuthorizationManager
    {
        #region Server-side Authorization
        public override bool CheckAccess(AuthorizationContext context)
        {
            var resource = context.Resource.First();
            var operation = context.Action.First();
            var identity = context.Principal.Identities.First();

            // only deal with app specific authorization requests
            if (resource.Type != ClaimPermission.ResourceType)
            {
                return base.CheckAccess(context);
            }

            switch (resource.Value)
            {
                case "TodoItems":
                    return AuthorizeTodoItemsAccess(operation.Value, identity);
                default:
                    return false;
            }
        }

        private bool AuthorizeTodoItemsAccess(string operation, ClaimsIdentity identity)
        {
            // TODO: talk to repository here
            if (identity.Name == "cw")
            {
                return true;
            }

            return false;
        }

        private bool AuthorizeDiagnosticsAccess(string operation, ClaimsIdentity identity)
        {
            // TODO: talk to repository here
            if (identity.Name == "cw")
            {
                return true;
            }

            return false;

        }
        
        #endregion

        #region UI Claims
        public override UiClaimsData GetUiClaims(IPrincipal principal)
        {
            var uiclaims = new UiClaimsData
            {
                UserName = principal.Identity.Name,

                Roles = GetRoles(principal),
                Capabilities = GetCapabilities(principal),
                Constraints = GetConstraints(principal),
                NameValueClaims = GetNameValueClaims(principal)
            };

            return uiclaims;
        }

        public override UiClaimsMetadata GetUiClaimsMetadata()
        {
            return new UiClaimsMetadata
            {
                Roles = new List<ClaimDescription>
                {
                    new ClaimDescription("Users", "Standard users"),
                    new ClaimDescription("PremiumUsers", "Premium users"),
                    new ClaimDescription("Administrators", "Users with administrative privileges")
                },

                Capabilities = new List<ClaimDescription>
                {
                    new ClaimDescription("UploadPhoto", "Allows uploading a photo for a TODO item"),
                },

                Constraints = new List<ClaimDescription> 
                {
                    new ClaimDescription("MaxNumberOfitems", "Limits the maximum number of TODO items")
                },

                Values = new List<ClaimDescription>
                {
                    new ClaimDescription("Email", "Email address of the current user"),
                    new ClaimDescription("GivenName", "First name of the current user")
                }
            };
        }

        #region Get per user claims
        private Constraints GetConstraints(IPrincipal principal)
        {
            double itemsLimit = GetItemsLimit(principal.Identity.Name);

            return new Constraints
            {
                new NumericConstraint
                {
                    Name = "MaxNumberOfitems",
                    LowerLimit = 0,
                    UpperLimit = itemsLimit
                }
            };
        }

        private double GetItemsLimit(string userName)
        {
            // TODO: talk to repository here
            if (userName == "cw")
            {
                return 100;
            }
            else
            {
                return 5;
            }
        }

        private Capabilities GetCapabilities(IPrincipal principal)
        {
            // TODO: talk to repository here
            if (principal.Identity.Name.Equals("cw"))
            {
                return new Capabilities
                {
                    "UploadPhoto"
                };
            }
            else
            {
                return new Capabilities
                {
                };
            }
        }

        private Roles GetRoles(IPrincipal principal)
        {
            // TODO: talk to repository here
            if (principal.Identity.Name.Equals("cw"))
            {
                return new Roles
                {
                    "PremiumUsers",
                    "Administrators"
                };
            }
            else
            {
                return new Roles
                {
                    "Users"
                };
            }
        }

        private NameValueClaims GetNameValueClaims(IPrincipal principal)
        {
            // TODO: talk to repository here
            if (principal.Identity.Name.Equals("cw"))
            {
                return new NameValueClaims
                {
                    new NameValueClaim("Email", "christian.weyer@thinktecture.com"),
                    new NameValueClaim("GivenName", "Chris"),
                };
            }
            else
            {
                return new NameValueClaims
                {
                    new NameValueClaim("Email", "na@thinktecture.com"),
                    new NameValueClaim("GivenName", "N/A"),
                };
            }
        }
        #endregion
        #endregion
    }
}
