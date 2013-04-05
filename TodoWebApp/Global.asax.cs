using System.Data.Entity;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using Todo.DataAccess;
using Todo.Hosting.Config;

namespace Todo.WebApp
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            BundleConfig.RegisterBundles(BundleTable.Bundles);
            WebApiConfig.Register(GlobalConfiguration.Configuration);
            SecurityConfig.Register(GlobalConfiguration.Configuration);
            HubConfig.Register(RouteTable.Routes);

            HibernatingRhinos.Profiler.Appender.EntityFramework.EntityFrameworkProfiler.Initialize();
            Database.SetInitializer<TodoContext>(new DropCreateDatabaseIfModelChanges<TodoContext>());
        }
    }
}