using Thinktecture.Applications.Framework;
using Todo.Entities;

namespace Todo.DataAccess
{
    public class TodoRepository : GenericRepository<TodoContext, TodoItem>
    {
    }
}
