using Todo.Entities;

namespace Todo.DataAccess.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<Todo.DataAccess.TodoContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
            ContextKey = "Todo.DataAccess.TodoContext";
        }

        protected override void Seed(Todo.DataAccess.TodoContext context)
        {
            var r = new Random();
            var items = Enumerable.Range(1, 50).Select(o => new TodoItem
            {
                Id = Guid.NewGuid(),
                Created = new DateTime(2012, r.Next(1, 12), r.Next(1, 28)),
                Done = false,
                Title = o.ToString(),
                Details = "TODO item no. " + o,
                Owner = "cw"
            }).ToArray();
            context.TodoItems.AddOrUpdate(item => new { item.Title }, items);
        }
    }
}
