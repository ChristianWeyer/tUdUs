﻿using Microsoft.IdentityModel.Claims;

namespace Todo.Security
{
    public class GlobalClaimsAuthenticationManager : ClaimsAuthenticationManager
    {
        public override IClaimsPrincipal Authenticate(string resourceName, IClaimsPrincipal incomingPrincipal)
        {            
            return base.Authenticate(resourceName, incomingPrincipal);
        }
    }
}
