using System.Web.Routing;

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
