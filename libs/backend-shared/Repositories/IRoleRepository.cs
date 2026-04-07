using System;
using NokAir.Core.Abstractions.Repositories.Rbac;
using NokAir.TalkToCeo.Shared.Entities.Common;

namespace NokAir.TalkToCeo.Shared.Repositories
{
    public interface IRoleRepository<T> : IRoleRepositoryBase<T>
        where T : class
    {
        /// <summary>
        /// Gets all roles asynchronously.
        /// </summary>
        /// <param name="cancellationToken">A cancellation token to observe while waiting for the task to complete.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains an enumerable collection of <see cref="Role"/>.</returns>
        Task<IEnumerable<Role>> FindAllAsync(CancellationToken cancellationToken = default);
    }
}
