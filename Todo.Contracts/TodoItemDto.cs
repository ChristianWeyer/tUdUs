
using ProtoBuf;
using System.Runtime.Serialization;
namespace Todo.Contracts
{
    [ProtoContract(ImplicitFields = ImplicitFields.AllPublic)]
    [DataContract]
    public class TodoItemDto
    {
        [DataMember(Name="id")]
        public int Id { get; set; }
        [DataMember(Name = "title")]
        public string Title { get; set; }
        [DataMember(Name = "details")]
        public string Details { get; set; }
        [DataMember(Name = "done")]
        public bool Done { get; set; }
    }
}
