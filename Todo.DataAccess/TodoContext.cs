using System.Data.Entity;
using Todo.Entities;

namespace Todo.DataAccess
{
    public class TodoContext : DbContext
    {
        public DbSet<TodoItem> TodoItems { get; set; }
    }
}
