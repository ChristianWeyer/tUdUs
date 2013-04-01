using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;

namespace Todo.Services
{
    internal static class BlobHelper
    {
        public static CloudBlobContainer GetContainer()
        {
            var storageAccount = CloudStorageAccount.Parse(
                CloudConfigurationManager.GetSetting("cloudStorageConnectionString"));
            var blobClient = storageAccount.CreateCloudBlobClient();

            var container = blobClient.GetContainerReference("todospictures");
            container.CreateIfNotExist();

            var permissions = container.GetPermissions();

            if (permissions.PublicAccess == BlobContainerPublicAccessType.Off)
            {
                permissions.PublicAccess = BlobContainerPublicAccessType.Blob;
                container.SetPermissions(permissions);
            }

            return container;
        }
    }
}