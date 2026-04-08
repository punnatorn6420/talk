using System;
using NokAir.Core.Abstractions.Repositories.Rbac;
using NokAir.TalkToCeo.Shared.Entities.Common;

namespace NokAir.TalkToCeo.Shared.Repositories
{
    /// <summary>
    /// Represents a repository for managing roles in the application. This interface extends the base role repository interface and provides additional functionality specific to the application's requirements.
    /// </summary>
    /// <typeparam name="T">The type of the role entity.</typeparam>
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
