using Todo.Base;
using Todo.Entities;

namespace Todo.DataAccess
{
    public class TodoRepository : GenericRepository<TodoContext, TodoItem>
    {
    }
}
