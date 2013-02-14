using System.Web;
using System.Web.Routing;
using Microsoft.AspNet.SignalR;

namespace Todo.WebApp
{
    public static class HubConfig
    {
        public static void Register(RouteCollection routes)
        {
            routes.MapHubs();
        }
    }
}
