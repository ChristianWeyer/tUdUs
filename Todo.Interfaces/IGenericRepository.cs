using System;
using System.Linq;
using System.Linq.Expressions;

namespace Todo.Base
{
    public interface IGenericRepository<TEntity> : IDisposable where TEntity : class
    {
        IQueryable<TEntity> GetAll();
        IQueryable<TEntity> FindBy(Expression<Func<TEntity, bool>> predicate);
        TEntity Insert(TEntity entity);
        void Delete(TEntity entity);
        TEntity Update(TEntity entity);
    }
}
