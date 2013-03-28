using System.Data.Entity;
using Todo.Entities;

namespace Todo.DataAccess
{
    public class TodoContext : DbContext
    {
        //public TodoContext(string cs)
        //{
                
        //}

        public DbSet<TodoItem> TodoItems { get; set; }
    }
}
