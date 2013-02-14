using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using Todo.DataAccess;

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
            SecurityConfig.Configure(GlobalConfiguration.Configuration);
            HubConfig.Register(RouteTable.Routes);

            //Database.DefaultConnectionFactory = new
            //            SqlCeConnectionFactory("System.Data.SqlServerCe.4.0");
            Database.SetInitializer<TodoContext>(new DropCreateDatabaseIfModelChanges<TodoContext>());
        }
    }
}