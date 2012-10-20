using SignalR.Hubs;

namespace Todo.WebApi
{
    [HubName("todos")]
    public class TodosHub : Hub
    {
    }
}
