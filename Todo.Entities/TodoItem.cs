using System;

namespace Todo.Entities
{
    public class TodoItem
    {        
        public Guid Id { get; set; }
        public string Owner { get; set; }
        public string Title { get; set; }
        public string Details { get; set; }
        public DateTime Created { get; set; }
        public bool Done { get; set; }
        public string AssignedTo { get; set; }
        public string PictureUrl { get; set; }
    }
}
