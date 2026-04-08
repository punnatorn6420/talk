using NokAir.TalkToCeo.Shared.Entities.Common;

namespace NokAir.TalkToCeo.Shared.Repositories
{
    /// <summary>
    /// Defines the contract for a user-role repository in the "Talk to CEO" system. This interface outlines the methods for managing user-role associations, including adding roles to users and retrieving user roles based on user identifiers. Implementing this interface allows for consistent data access and manipulation of user-role relationships within the application, enabling features such as assigning roles to users and retrieving the roles associated with specific users.
    /// </summary>
    public interface IUserRoleRepository
    {
        /// <summary>
        /// Adds one or more roles to a user asynchronously.
        /// </summary>
        /// <param name="userId">The unique identifier of the user.</param>
        /// <param name="roleIds">An array of role identifiers to associate with the user.</param>
        /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
        /// <returns>A task representing the asynchronous operation.</returns>
        Task AddUserRoleAsync(int userId, int[] roleIds, CancellationToken cancellationToken = default);

        /// <summary>
        /// Retrieves all user-role associations for a specified user asynchronously.
        /// </summary>
        /// <param name="userId">The unique identifier of the user.</param>
        /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
        /// <returns>
        /// A task that represents the asynchronous operation. The task result contains a list of <see cref="UserRole"/> objects associated with the user.
        /// </returns>
        Task<List<UserRole>> FindUserRolesByUserIdAsync(int userId, CancellationToken cancellationToken = default);
    }
}
