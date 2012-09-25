
using ProtoBuf;
namespace Todo.Contracts
{
    [ProtoContract(ImplicitFields = ImplicitFields.AllPublic)]
    public class TodoItemDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Details { get; set; }
        public bool Done { get; set; }
    }
}
