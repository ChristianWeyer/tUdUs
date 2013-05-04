using Thinktecture.Applications.Framework;
using Todo.Entities;

namespace Todo.DataAccess
{ 
	public partial class LinkRepository : GenericRepository<TodoContext, Link>
	{
	}
	public partial class TodoItemRepository : GenericRepository<TodoContext, TodoItem>
	{
	}
}