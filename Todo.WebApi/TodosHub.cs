using SignalR.Hubs;

namespace Todo.WebApi
{
    // This hub has no inbound APIs, since all inbound communication is done
    // via the Web API. It's here for clients which want to get continuous
    // notification of changes.
    [HubName("todos")]
    public class TodosHub : Hub { }
}
