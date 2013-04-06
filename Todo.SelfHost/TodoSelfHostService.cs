using System;
using System.Reflection;
using System.ServiceProcess;
using System.Web.Http.SelfHost;
using Microsoft.AspNet.SignalR;
using Microsoft.Owin.Hosting;
using Owin;
using System.Web.Http.Cors;
using Todo.Hosting;

namespace Todo.SelfHost
{
    public partial class TodoSelfHostService : ServiceBase
    {
        private const string webApiUrl = "http://localhost:7778/web";
        private const string signalRUrl = "http://localhost:7778/push";

        private HttpSelfHostServer webApiServer;
        private IDisposable signalRServer;

        public TodoSelfHostService()
        {
            InitializeComponent();

            webApiServer = SetupWebApiServer(webApiUrl);
        }

        protected override async void OnStart(string[] args)
        {            
            signalRServer = WebApplication.Start<Startup>(signalRUrl);
            await webApiServer.OpenAsync();
        }

        protected override async void OnStop()
        {
            if (webApiServer != null)
            {
                await webApiServer.CloseAsync();
            }

            if (signalRServer != null)
            {
                signalRServer.Dispose();
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

        private static HttpSelfHostServer SetupWebApiServer(string url)
        {
            var configuration = new HttpSelfHostConfiguration(url);
            WebApiConfig.Register(configuration);
            SecurityConfig.Register(configuration);
            configuration.EnableCors(new EnableCorsAttribute());

            var host = new HttpSelfHostServer(configuration);

            return host;
        }
    }

    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            var a = Assembly.LoadFrom("Todo.Services.dll");

            app.MapHubs(
                new HubConfiguration
                {
                    EnableCrossDomain = true
                });
        }
    }
}
