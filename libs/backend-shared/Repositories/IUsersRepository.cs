using NokAir.Core.Abstractions.Repositories.Rbac;
using NokAir.TalkToCeo.Shared.Entities.Common;

namespace NokAir.TalkToCeo.Shared.Repositories
{
    /// <summary>
    /// Represents a repository for managing users in the application. This interface extends the base user repository interface and provides additional functionality specific to the application's requirements, such as adding a user and finding a user by specific criteria.
    /// </summary>
    /// <typeparam name="T">The type of the user entity.</typeparam>
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

        /// <summary>
        /// Counts the total number of users in the repository. This method is used to retrieve the total count of user entities stored in the underlying data store. The implementation of this method will handle the specifics of how the data is retrieved and counted, allowing for separation of concerns and easier maintenance of the codebase.
        /// </summary>
        /// <returns>A task that represents the asynchronous operation. The task result contains the total number of users.</returns>
        Task<int> FindUserCountAsync();

        /// <summary>
        /// Determines whether a user with the specified ID has the CEO role. This method checks if the user associated with the given user ID has been assigned the CEO role within the application's role management system. The implementation will typically involve querying the user-role relationships and role definitions to verify if the user holds the CEO role, returning a boolean value indicating the result.
        /// </summary>
        /// <param name="userId">The ID of the user to check.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains <c>true</c> if the user is a CEO; otherwise, <c>false</c>.</returns>
        Task<bool> FindIsUserCeoAsync(int userId);
    }
}
