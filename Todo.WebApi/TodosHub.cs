﻿using SignalR.Hubs;

namespace Todo.WebApi
{
    /// <summary>
    /// Hub implementation which offers outbound API via SignalR.
    /// </summary>
    [HubName("todos")]
    public class TodosHub : Hub
    {
    }
}
