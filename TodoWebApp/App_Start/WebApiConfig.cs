using System.Net.Http.Formatting;
using Autofac;
using Autofac.Integration.WebApi;
using Newtonsoft.Json.Serialization;
using System.Reflection;
using System.Web.Http;

namespace Todo.WebApp
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            config.Formatters.JsonFormatter.AddQueryStringMapping(
                "$format", "json", "application/json");
            config.Formatters.XmlFormatter.AddQueryStringMapping(
                "$format", "xml", "application/xml");

            config.Routes.MapHttpRoute(
                name: "ACSApi",
                routeTemplate: "api/acs/{action}/{ns}/{realm}",
                defaults: new { controller = "Acs", ns = RouteParameter.Optional, realm = RouteParameter.Optional });

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            config.EnableSystemDiagnosticsTracing();
            config.EnableQuerySupport();

            config.Formatters.JsonFormatter.SerializerSettings.ContractResolver =
                new CamelCasePropertyNamesContractResolver();

            var builder = new ContainerBuilder();

            var webApiAssembly = Assembly.Load("Todo.WebApi");
            builder.RegisterApiControllers(webApiAssembly);

            var assembly = Assembly.Load("Todo.DataAccess");
            builder.RegisterAssemblyTypes(assembly)
                .Where(t => t.Name.EndsWith("Repository"))
                .AsImplementedInterfaces()
                .InstancePerApiRequest();

            var container = builder.Build();
            var resolver = new AutofacWebApiDependencyResolver(container);
            config.DependencyResolver = resolver;
        }
    }
}
