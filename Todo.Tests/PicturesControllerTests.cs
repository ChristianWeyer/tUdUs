using System.Linq;
using System.Security.Claims;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Todo.DataAccess;
using Todo.WebApi;
using System.Security.Principal;
using System.Threading;

namespace Todo.Tests
{
    [TestClass]
    public class PicturesControllerTests
    {
        [TestMethod]
        public void Test_Get_Pictures_For_Given_User()
        {
            Thread.CurrentPrincipal =
                new GenericPrincipal(new GenericIdentity("cw"), null);
            
            var pc = new PicturesController(
                new TodoRepository());
            var pics = pc.Get().ToList();

            Assert.IsNotNull(pics);
            Assert.IsTrue(pics.Count > 0);
        }
    }
}
