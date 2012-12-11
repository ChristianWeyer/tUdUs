using System;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Todo.Base
{
    public abstract class GenericRepository<TDbContext, TEntity> :
        IGenericRepository<TEntity>
        where TEntity : class
        where TDbContext : DbContext, new()
    {
        private TDbContext entities = new TDbContext();

        protected TDbContext Context
        {
            get { return entities; }
            set { entities = value; }
        }

        public virtual IQueryable<TEntity> GetAll()
        {
            IQueryable<TEntity> query = entities.Set<TEntity>();

            return query;
        }

        public IQueryable<TEntity> FindBy(Expression<Func<TEntity, bool>> predicate)
        {
            IQueryable<TEntity> query = entities.Set<TEntity>().Where(predicate);

            return query;
        }

        public virtual TEntity Insert(TEntity entity)
        {
            entities.Set<TEntity>().Add(entity);
            Save();

            return entity;
        }

        public virtual void Delete(TEntity entity)
        {
            entities.Entry<TEntity>(entity).State = EntityState.Deleted;
            Save();
        }

        public virtual TEntity Update(TEntity entity)
        {
            entities.Entry(entity).State = EntityState.Modified;
            Save();

            return entity;
        }

        public async virtual Task<TEntity> InsertAsync(TEntity entity)
        {
            entities.Set<TEntity>().Add(entity);
            await SaveAsync();

            return entity;
        }
        public async virtual void DeleteAsync(TEntity entity)
        {
            entities.Entry<TEntity>(entity).State = EntityState.Deleted;
            await SaveAsync();
        }

        public async virtual Task<TEntity> UpdateAsync(TEntity entity)
        {
            entities.Entry(entity).State = EntityState.Modified;
            await SaveAsync();

            return entity;
        }

        private async Task SaveAsync()
        {
            await entities.SaveChangesAsync();
        }
 
        private void Save()
        {
            entities.SaveChanges();
        }

        private bool disposed = false;

        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    entities.Dispose();
                }
            }
            this.disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
    }
}
