using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Todo.Base;

namespace Todo.Entities
{
    public abstract class EntityBase : IDataWithState
    {
        [Key]
        public Guid Id { get; set; }

        [NotMapped]
        public DataState State { get; set; }
    }
}
