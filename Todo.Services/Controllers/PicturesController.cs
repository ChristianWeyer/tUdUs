using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using Todo.Base;
using Todo.Entities;

namespace Todo.Services
{
    /// <summary>
    /// Controller for uploading pictures
    /// </summary>
    public class PicturesController : ApiController
    {
        private readonly IGenericRepository<TodoItem> repository;

        /// <summary>
        /// Initializes a new instance of the <see cref="PicturesController" /> class.
        /// </summary>
        /// <param name="repository">The repository.</param>
        public PicturesController(IGenericRepository<TodoItem> repository)
        {
            this.repository = repository;
        }
        /// <summary>
        /// Post pictures to this action.
        /// </summary>
        /// <returns></returns>
        /// <exception cref="System.Web.Http.HttpResponseException"></exception>
        [AllowAnonymous]
        public Task<List<FileDetails>> Post()
        {
            if (!Request.Content.IsMimeMultipartContent("form-data"))
            {
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
            }

            var multipartStreamProvider = new BlobStorageMultipartProvider(BlobHelper.GetContainer());

            return Request.Content.ReadAsMultipartAsync<BlobStorageMultipartProvider>(multipartStreamProvider).ContinueWith<List<FileDetails>>(t =>
            {
                if (t.IsFaulted)
                {
                    if (t.Exception != null)
                    {
                        //TODO: Tracing!
                        throw t.Exception;
                    }
                }

                var provider = t.Result;

                return provider.Files;
            });
        }

        [Queryable]
        public IQueryable<string> Get()
        {
            var todos = repository.FindBy(t => t.Owner == User.Identity.Name);

            return todos.Select(t => t.PictureUrl);
        }
    }

    /// <summary>
    /// File details DTO.
    /// </summary>
    public class FileDetails
    {
        /// <summary>
        /// Gets or sets the name.
        /// </summary>
        /// <value>
        /// The name.
        /// </value>
        public string Name { get; set; }
        /// <summary>
        /// Gets or sets the size.
        /// </summary>
        /// <value>
        /// The size.
        /// </value>
        public long Size { get; set; }
        /// <summary>
        /// Gets or sets the type of the content.
        /// </summary>
        /// <value>
        /// The type of the content.
        /// </value>
        public string ContentType { get; set; }
        /// <summary>
        /// Gets or sets the location.
        /// </summary>
        /// <value>
        /// The location.
        /// </value>
        public string Location { get; set; }
    }
}