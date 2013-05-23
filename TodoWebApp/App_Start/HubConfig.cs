using System.Web.Routing;
using Microsoft.AspNet.SignalR;

namespace Todo.WebApp
{
    public static class HubConfig
    {
        public static void Register(RouteCollection routes)
        {
            const string connectionString = "Data Source=(local);Initial Catalog=SignalRBackend;Integrated Security=SSPI;Asynchronous Processing=True;";
            //GlobalHost.DependencyResolver.UseSqlServer(connectionString);

            var hubConfig = new HubConfiguration { EnableCrossDomain = true };
            routes.MapHubs(hubConfig);
        }
    }
}
