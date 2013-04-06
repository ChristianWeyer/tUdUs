using System;
using System.Reflection;
using System.ServiceProcess;
using System.Web.Http;
using Microsoft.AspNet.SignalR;
using Microsoft.Owin.Hosting;
using Owin;
using System.Web.Http.Cors;
using Todo.Hosting;
using System.Configuration;

namespace Todo.SelfHost
{
    public partial class TodoSelfHostService : ServiceBase
    {
        private string baseUrl = ConfigurationManager.AppSettings["SelfHost.BaseUrl"];
        private IDisposable server;

        public TodoSelfHostService()
        {
            InitializeComponent();
        }

        protected override async void OnStart(string[] args)
        {
            server = WebApplication.Start<Startup>(baseUrl);
        }

        protected override async void OnStop()
        {
            if (server != null)
            {
                server.Dispose();
            }
        }

        public void InteractiveStart(string[] args)
        {
            OnStart(args);
        }

        public void InteractiveStop()
        {
            OnStop();
        }
    }

    public class Startup
    {
        public void Configuration(IAppBuilder builder)
        {
            var a = Assembly.LoadFrom("Todo.Services.dll");
            var hubConfig = new HubConfiguration { EnableCrossDomain = true };
            builder.MapHubs(hubConfig);

            var webApiConfig = new HttpConfiguration();
            WebApiConfig.Register(webApiConfig);
            SecurityConfig.Register(webApiConfig);
            webApiConfig.EnableCors(new EnableCorsAttribute());
            builder.UseWebApi(webApiConfig);
        }
    }
}
