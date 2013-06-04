using System.Diagnostics;
using Autofac;
using Autofac.Integration.WebApi;
using Essential.Diagnostics.Abstractions;
using Newtonsoft.Json.Serialization;
using Serilog;
using System.Net.Http.Formatting;
using System.Reflection;
using System.Web.Http;
using Thinktecture.Applications.Framework.WebApi;

namespace Todo.Hosting
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            Log.Logger = new LoggerConfiguration()
                .WriteTo.Console()
                //.WriteTo.MongoDB("mongodb://localhost:27017/todoslogs")
                .CreateLogger();

            config.Formatters.Clear();
            config.Formatters.Add(new JsonMediaTypeFormatter());
            config.Formatters.JsonFormatter.AddQueryStringMapping(
                "$format", "json", "application/json");

            config.Services.Replace(typeof(IContentNegotiator), new JsonContentNegotiator());
            
            config.Routes.MapHttpRoute(
                name: "UiClaimsApi",
                routeTemplate: "api/uiclaims/{action}",
                defaults: new { controller = "UiClaims" });

            config.Routes.MapHttpRoute(
                name: "ACSApi",
                routeTemplate: "api/acs/{action}/{ns}/{realm}",
                defaults: new { controller = "Acs", ns = RouteParameter.Optional, realm = RouteParameter.Optional });

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional });

            config.EnableSystemDiagnosticsTracing();
            config.EnableQuerySupport();

            config.Formatters.JsonFormatter.SerializerSettings.ContractResolver =
                new CamelCasePropertyNamesContractResolver();

            var resolver = ConfigureContainer();
            config.DependencyResolver = resolver;
        }

        private static AutofacWebApiDependencyResolver ConfigureContainer()
        {
            var builder = new ContainerBuilder();

            var webApiAssembly = Assembly.Load("Todo.Services");
            builder.RegisterApiControllers(webApiAssembly);

            var assembly = Assembly.Load("Todo.DataAccess");
            builder.RegisterAssemblyTypes(assembly)
                   .Where(t => t.Name.EndsWith("Repository"))
                   .AsImplementedInterfaces()
                   .InstancePerApiRequest();

            builder.Register(
                c => new TraceSource("tUdUs")).As<TraceSource>();
            builder.Register(
                c => new TraceSourceWrapper(c.Resolve<TraceSource>())).As<ITraceSource>();

            var container = builder.Build();
            var resolver = new AutofacWebApiDependencyResolver(container);

            return resolver;
        }
    }
}
