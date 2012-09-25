using System;
using System.Web.Http;
using SignalR;
using SignalR.Hubs;

namespace Todo.Base
{
    public abstract class HubApiController<THub> : ApiController
        where THub : IHub
    {
        Lazy<IHubContext> hub = new Lazy<IHubContext>(
            () => GlobalHost.ConnectionManager.GetHubContext<THub>()
        );

        protected IHubContext Hub
        {
            get { return hub.Value; }
        }
    }
}
