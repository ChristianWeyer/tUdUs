using System.ServiceProcess;
using System.Web.Http.SelfHost;
using Todo.Hosting.Config;

namespace Todo.SelfHost
{
    public partial class TodoSelfHostService : ServiceBase
    {
        private const string webApiUrl =
            "http://localhost:7778/";

        private HttpSelfHostServer server;

        public TodoSelfHostService()
        {
            InitializeComponent();

            server = SetupWebApiServer(webApiUrl);
        }

        protected override async void OnStart(string[] args)
        {
            await server.OpenAsync();
        }

        protected override async void OnStop()
        {
            if (server != null)
            {
                await server.CloseAsync();
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

            var host = new HttpSelfHostServer(configuration);

            return host;
        }
    }
}
