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
                db.TodoItems.Take((1));
            }
        }
    }
}
