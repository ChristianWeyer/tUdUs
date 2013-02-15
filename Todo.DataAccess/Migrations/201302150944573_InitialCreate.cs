namespace Todo.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class InitialCreate : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.TodoItems",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Owner = c.String(maxLength: 4000),
                        Title = c.String(maxLength: 4000),
                        Details = c.String(maxLength: 4000),
                        Created = c.DateTime(nullable: false),
                        Location = c.String(maxLength: 4000),
                        Done = c.Boolean(nullable: false),
                        AssignedTo = c.String(maxLength: 4000),
                        PictureUrl = c.String(maxLength: 4000),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.TodoItems");
        }
    }
}
