using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Todo.Contracts;
using Todo.Entities;

namespace Todo.WebApi
{
    public static class DataMapper
    {
        static DataMapper()
        {
            Mapper.CreateMap<TodoItem, TodoItemDto>();
            Mapper.CreateMap<TodoItemDto, TodoItem>()
                .ForMember(m => m.Owner, o => o.Ignore())
                .ForMember(m => m.AssignedTo, o => o.Ignore());

            Mapper.AssertConfigurationIsValid();
        }

        public static TodoItemDto Map(this TodoItem item)
        {
            return Mapper.Map<TodoItemDto> (item);
        }

        public static TodoItem Map(this TodoItemDto item)
        {
            return Mapper.Map<TodoItem> (item);
        }

        public static IEnumerable<TodoItemDto> Map(this IEnumerable<TodoItem> items)
        {
            return Mapper.Map<IEnumerable<TodoItemDto>>(items);
        }

        public static IEnumerable<TodoItem> Map(this IEnumerable<TodoItemDto> items)
        {
            return Mapper.Map<IEnumerable<TodoItem>>(items);
        }

        public static IQueryable<TodoItemDto> Map(this IQueryable<TodoItem> items)
        {
            return items.Project<TodoItem>().To<TodoItemDto>();
        }
    }
}