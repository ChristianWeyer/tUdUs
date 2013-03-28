using Newtonsoft.Json;
using ProtoBuf;
using System;

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
        [JsonProperty(PropertyName = "location")]
        public string Location { get; set; }
        [JsonProperty(PropertyName = "done")]
        public bool Done { get; set; }
        [JsonProperty(PropertyName = "pictureUrl")]
        public string PictureUrl { get; set; }
    }
}
