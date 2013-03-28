﻿using System.Data.Entity;

namespace Todo.Base
{
    public class StateMapper
    {
        public static EntityState ConvertState(DataState state)
        {
            switch (state)
            {
                case DataState.Added:
                    return EntityState.Added;
                case DataState.Modified:
                    return EntityState.Modified;
                case DataState.Deleted:
                    return EntityState.Deleted;
                default:
                    return EntityState.Unchanged;
            }
        }
    }
}
