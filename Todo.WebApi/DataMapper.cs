using AutoMapper;
using AutoMapper.QueryableExtensions;
using System.Collections.Generic;
using System.Linq;
using Todo.Contracts;
using Todo.Entities;

namespace Todo.WebApi
{
    /// <summary>
    /// Class for mapping entities to DTOs and vice versa.
    /// </summary>
    public static class DataMapper
    {
        static DataMapper()
        {
            Mapper.CreateMap<TodoItem, TodoItemDto>();
            Mapper.CreateMap<TodoItemDto, TodoItem>()
                .ForMember(m => m.Owner, o => o.Ignore())
                .ForMember(m => m.AssignedTo, o => o.Ignore())
                .ForMember(m => m.State, o => o.Ignore());

            Mapper.AssertConfigurationIsValid();
        }

        /// <summary>
        /// Maps the specified item.
        /// </summary>
        /// <param name="item">The item.</param>
        /// <returns></returns>
        public static TodoItemDto Map(this TodoItem item)
        {
            return Mapper.Map<TodoItemDto> (item);
        }

        /// <summary>
        /// Maps the specified item.
        /// </summary>
        /// <param name="item">The item.</param>
        /// <returns></returns>
        public static TodoItem Map(this TodoItemDto item)
        {
            return Mapper.Map<TodoItem> (item);
        }

        /// <summary>
        /// Maps the specified items.
        /// </summary>
        /// <param name="items">The items.</param>
        /// <returns></returns>
        public static IEnumerable<TodoItemDto> Map(this IEnumerable<TodoItem> items)
        {
            return Mapper.Map<IEnumerable<TodoItemDto>>(items);
        }

        /// <summary>
        /// Maps the specified items.
        /// </summary>
        /// <param name="items">The items.</param>
        /// <returns></returns>
        public static IEnumerable<TodoItem> Map(this IEnumerable<TodoItemDto> items)
        {
            return Mapper.Map<IEnumerable<TodoItem>>(items);
        }

        /// <summary>
        /// Maps the specified items.
        /// </summary>
        /// <param name="items">The items.</param>
        /// <returns></returns>
        public static IQueryable<TodoItemDto> Map(this IQueryable<TodoItem> items)
        {
            return items.Project().To<TodoItemDto>();
        }
    }
}