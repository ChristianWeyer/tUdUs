using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Todo.Entities
{
    public class TodoItem
    {
        [Key]
        public Guid Id { get; set; }
        public string Owner { get; set; }
        public string Title { get; set; }
        public string Details { get; set; }
        public DateTime Created { get; set; }
        public string Location { get; set; }
        public bool Done { get; set; }
        public string AssignedTo { get; set; }
        public string PictureUrl { get; set; }
    }
}
