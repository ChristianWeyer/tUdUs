using System;
using System.Collections.Generic;

namespace Todo.Entities
{
    public class TodoItem : EntityBase
    {
        public string Owner { get; set; }
        public string Title { get; set; }
        public string Details { get; set; }
        public DateTime Created { get; set; }
        public string Location { get; set; }
        public bool Done { get; set; }
        public string AssignedTo { get; set; }
        public string PictureUrl { get; set; }
        //public List<Link> Links { get; set; }
    }
}
