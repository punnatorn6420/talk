using NokAir.Core.Abstractions.Repositories.Rbac;
using NokAir.TalkToCeo.Shared.Entities.Common;
namespace NokAir.TalkToCeo.Shared.Repositories
{
    public interface IUsersRepository<T> : IUserRepositoryBase<T>
        where T : class
    {
        /// <summary>
        /// Adds a user asynchronously.
        /// </summary>
        /// <param name="user">The user to add.</param>
        /// <param name="cancellationToken">cancellationToken.</param>
        /// <returns>A task representing the asynchronous operation.</returns>
        Task AddUserAsync(User user, CancellationToken cancellationToken = default);

        /// <summary>
        /// Gets a user by optional search parameters.
        /// </summary>
        /// <param name="email">The email address of the user (optional).</param>
        /// <param name="firstname">The first name of the user (optional).</param>
        /// <param name="lastname">The last name of the user (optional).</param>
        /// <param name="objectId">The object ID of the user (optional).</param>
        /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
        /// <returns>
        /// A task that represents the asynchronous operation. The task result contains the user if found; otherwise, <c>null</c>.
        /// </returns>
        Task<User?> FindUserByCriteriaAsync(string? email = null, string? firstname = null, string? lastname = null, string? objectId = null, CancellationToken cancellationToken = default);
    }
}
