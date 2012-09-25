using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Web.Http;
using Thinktecture.IdentityModel.Authorization.WebApi;
using Todo.Base;
using Todo.Contracts;
using Todo.Entities;

namespace Todo.WebApi
{
    [ApiAuthorize]
    public class TodosController : HubApiController<TodosHub>
    {
        private IGenericRepository<TodoItem> repository;

        public TodosController(IGenericRepository<TodoItem> repository)
        {            
            this.repository = repository;
        }

        /// <summary>
        /// List available TODO items. Supports OData query syntax.
        /// </summary>
        /// <returns>List of items.</returns>
        [Queryable]
        public IQueryable<TodoItemDto> Get()
        {
            return repository.GetAll().Map();
        }

        /// <summary>
        /// Get a single TODO item by ID.
        /// </summary>
        /// <param name="id">The ID of the item</param>
        /// <returns>A TODO item.</returns>
        public TodoItemDto Get(int id)
        {
            var todo = repository.FindBy(t => t.Id == id).FirstOrDefault();

            if (todo == null)
            {
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }

            return todo.Map();
        }

        /// <summary>
        /// Add a new TODO item to the system.
        /// </summary>
        /// <param name="item">The new item.</param>
        /// <returns>The new item with up-to-date data.</returns>
        public TodoItemDto Post(TodoItemDto item)
        {
            var newItem = repository.Insert(item.Map());

            this.Hub.Clients.addItem(newItem);

            return newItem.Map();
        }

        /// <summary>
        /// Update an existing TODO item.
        /// </summary>
        /// <param name="item">The existing item.</param>
        /// <returns>The existing item with up-to-date data.</returns>
        public TodoItemDto Put(TodoItemDto item)
        {
            try
            {
                var updatedItem = repository.Update(item.Map());
                
                return updatedItem.Map();
            }
            catch (DbUpdateException duex)
            {
                throw new HttpResponseException(HttpStatusCode.BadRequest);
            }            
        }

        /// <summary>
        /// Delete an existing TODO item by ID.
        /// </summary>
        /// <param name="id">The ID of the item.</param>
        public void Delete(int id)
        {
            try
            {
                repository.Delete(new TodoItem { Id = id });
            }
            catch (DbUpdateException duex)
            {
                throw new HttpResponseException(HttpStatusCode.BadRequest);
            }            
        }
    }
}