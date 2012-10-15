using System;
using Newtonsoft.Json;
using ProtoBuf;

namespace Todo.Contracts
{
    [ProtoContract(ImplicitFields = ImplicitFields.AllPublic)]
    public class TodoItemDto
    {
        [JsonProperty(PropertyName = "id")]
        public Guid Id { get; set; }
        [JsonProperty(PropertyName = "title")]
        public string Title { get; set; }
        [JsonProperty(PropertyName = "details")]
        public string Details { get; set; }
        [JsonProperty(PropertyName = "created")]
        public DateTime Created { get; set; }
        [JsonProperty(PropertyName = "done")]
        public bool Done { get; set; }
        [JsonProperty(PropertyName = "pictureUrl")]
        public string PictureUrl { get; set; }
    }
}
