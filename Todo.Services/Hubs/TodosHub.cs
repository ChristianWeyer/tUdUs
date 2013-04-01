using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;

namespace Todo.Services
{
    /// <summary>
    /// Hub implementation which offers outbound API via SignalR.
    /// </summary>
    [HubName("todos")]
    public class TodosHub : Hub
    {
    }
}
