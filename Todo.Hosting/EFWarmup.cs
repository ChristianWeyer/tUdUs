using System.Linq;
using Todo.DataAccess;

namespace Todo.Hosting
{
    public class EFWarmup
    {
        public static void Run()
        {
            using (var db = new TodoContext())
            {
                var x = db.TodoItems.Take((1));
            }
        }
    }
}
