using System.Collections.Generic;
using System.Runtime.Serialization;

namespace Todo.Services.UiClaims
{
    public class UiClaimsMetadata
    {
        public List<ClaimDescription> Roles { get; set; }
        public List<ClaimDescription> Capabilities { get; set; }
        public List<ClaimDescription> Constraints { get; set; }
        public List<ClaimDescription> Values { get; set; }
    }

    public class ClaimDescription
    {
        public ClaimDescription()
        { }

        public ClaimDescription(string name, string description)
        {
            Name = name;
            Description = description;
        }

        public string Name { get; set; }
        public string Description { get; set; }
    }
}
