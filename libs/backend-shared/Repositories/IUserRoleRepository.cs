using NokAir.TalkToCeo.Shared.Entities.Common;

namespace NokAir.TalkToCeo.Shared.Repositories
{
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
