using System.Data.Entity;

namespace Todo.Base
{
    public static class DbContextHelper
    {
        // NOTE: Only use with short lived contexts (e.g. in per-call scenarios)
        public static void ApplyStateChanges(this DbContext context)
        {
            foreach (var entry in context.ChangeTracker.Entries<IDataWithState>())
            {
                var stateInfo = entry.Entity;
                entry.State = StateMapper.ConvertState(stateInfo.State);
            }
        }

        public static void ResetState(this DbContext context)
        {
            foreach (var entry in context.ChangeTracker.Entries<IDataWithState>())
            {
                entry.Entity.State = DataState.Unchanged;
            }
        }
    }
}
