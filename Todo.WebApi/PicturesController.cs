using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using Microsoft.WindowsAzure.StorageClient;

namespace Todo.WebApi
{
    [AllowAnonymous]
    public class PicturesController : ApiController
    {
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
                        //Todo: Tracing!
                        throw t.Exception;
                    }
                }

                var provider = t.Result;

                return provider.Files;
            });
        }
    }

    public class FileDetails
    {
        public string Name { get; set; }
        public long Size { get; set; }
        public string ContentType { get; set; }
        public string Location { get; set; }
    }
}