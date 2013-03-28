﻿using System;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Todo.Base;
using Todo.Contracts;
using Todo.Entities;

namespace Todo.WebApi
{
    /// <summary>
    /// The controller for TODO items.
    /// </summary>
    public class TodosController : HubApiController<TodosHub>
    {
        private readonly IGenericRepository<TodoItem> repository;

        /// <summary>
        /// Initializes a new instance of the <see cref="TodosController" /> class.
        /// </summary>
        /// <param name="repository">The repository.</param>
        public TodosController(IGenericRepository<TodoItem> repository)
        {            
            this.repository = repository;            
        }

        /// <summary>
        /// List available TODO items. Supports OData query syntax.
        /// </summary>
        /// <returns>List of items.</returns>
        [Queryable(PageSize=20)]
        public IQueryable<TodoItemDto> Get()
        {
            var userName = User.Identity.Name;

            return repository.GetAll().Where(t => t.Owner == userName).Map();
        }

        /// <summary>
        /// Get a single TODO item by ID.
        /// </summary>
        /// <param name="id">The ID of the item</param>
        /// <returns>A TODO item.</returns>
        public TodoItemDto Get(Guid id)
        {
            var todo = repository.FindBy(t => t.Id == id && t.Owner == User.Identity.Name).FirstOrDefault();

            if (todo == null)
            {
                // TODO: log...
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }

            return todo.Map();
        }

        /// <summary>
        /// Add a new TODO item to the system.
        /// </summary>
        /// <param name="item">The new item.</param>
        /// <returns>The new item with up-to-date data.</returns>
        public HttpResponseMessage Post(TodoItemDto item)
        {
            if (ModelState.IsValid)
            {
                var itemEntity = item.Map();
                itemEntity.Owner = User.Identity.Name;

                var newItem = repository.Insert(itemEntity);

                Hub.Clients.All.itemAdded(ConnectionId, item);

                string uri = Url.Link("DefaultApi", new { id = item.Id });
                var response = Request.CreateResponse<TodoItemDto>(HttpStatusCode.Created, newItem.Map());
                response.Headers.Location = new Uri(uri);

                return response;
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }
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
                var itemEntity = item.Map();
                itemEntity.Owner = User.Identity.Name;

                var updatedItem = repository.Update(itemEntity);
                Hub.Clients.All.itemUpdated(ConnectionId, item);
    
                return updatedItem.Map();
            }
            catch (DbUpdateException)
            {
                // TODO: log...
                throw new HttpResponseException(HttpStatusCode.BadRequest);
            }            
        }

        /// <summary>
        /// Delete an existing TODO item by ID.
        /// </summary>
        /// <param name="id">The ID of the item.</param>
        public void Delete(Guid id)
        {
            try
            {
                repository.Delete(new TodoItem { Id = id });
                Hub.Clients.All.itemDeleted(ConnectionId, id);
            }
            catch (DbUpdateException)
            {
                // TODO: log...
                throw new HttpResponseException(HttpStatusCode.BadRequest);
            }            
        }
    }
}