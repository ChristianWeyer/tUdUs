using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.WindowsAzure.StorageClient;

namespace Todo.WebApi
{
    /// <summary>
    /// A multi-part file stream provider to upload files to Windows Azure Blob Storage.
    /// </summary>
    public class BlobStorageMultipartProvider : MultipartFileStreamProvider
    {
        private readonly CloudBlobContainer container;

        /// <summary>
        /// Initializes a new instance of the <see cref="BlobStorageMultipartProvider" /> class.
        /// </summary>
        /// <param name="container">The container.</param>
        public BlobStorageMultipartProvider(CloudBlobContainer container)
            : base(Path.GetTempPath())
        {
            this.container = container;
            Files = new List<FileDetails>();
        }

        /// <summary>
        /// Gets or sets the files.
        /// </summary>
        /// <value>
        /// The files.
        /// </value>
        public List<FileDetails> Files { get; set; }
        
        public override Task ExecutePostProcessingAsync()
        {
            foreach (var fileData in FileData)
            {
                var fileName = Path.GetFileName(fileData.Headers.ContentDisposition.FileName.Trim('"'));

                var blob = container.GetBlobReference(fileName);
                blob.Properties.ContentType = fileData.Headers.ContentType.MediaType;
                blob.UploadFile(fileData.LocalFileName);

                File.Delete(fileData.LocalFileName);
                Files.Add(new FileDetails
                {
                    ContentType = blob.Properties.ContentType,
                    Name = blob.Name,
                    Size = blob.Properties.Length,
                    Location = blob.Uri.AbsoluteUri
                });
            }

            return base.ExecutePostProcessingAsync();
        }
    }
}