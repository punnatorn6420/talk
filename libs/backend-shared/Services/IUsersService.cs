using NokAir.Core.Abstractions.Services.Rbac;
using NokAir.TalkToCeo.Shared.Dtos;
using NokAir.TalkToCeo.Shared.Dtos.Common;

namespace NokAir.TalkToCeo.Shared.Services
{
    /// <summary>
    /// Represents a service for managing users in the application. This interface extends the base user service interface and provides additional functionality specific to the application's requirements, such as adding a flight IROP user and retrieving a flight IROP user based on a token asynchronously.
    /// </summary>
    /// <typeparam name="T">The type of the user entity.</typeparam>
    public interface IUsersService<T> : IUserServiceBase<T>
        where T : class
    {
        /// <summary>
        /// Adds a flight IROP user asynchronously.
        /// </summary>
        /// <param name="user">The flight IROP user to add.</param>
        /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
        /// <returns>
        /// A task that represents the asynchronous operation.
        /// </returns>
        Task AddUserAsync(AddUserFromPotal user, CancellationToken cancellationToken = default);

        /// <summary>
        /// Retrieves a flight IROP user based on the provided token asynchronously.
        /// </summary>
        /// <param name="token">The token used to identify the user.</param>
        /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
        /// <returns>
        /// A task that represents the asynchronous operation. The task result contains the flight IROP user DTO if found; otherwise, <c>null</c>.
        /// </returns>
        Task<UserDto?> GetUserFromTokenAsync(string token, CancellationToken cancellationToken = default);

        /// <summary>
        /// Determines whether the specified user is a CEO asynchronously.
        /// </summary>
        /// <param name="userId">The ID of the user to check.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains <c>true</c> if the user is a CEO; otherwise, <c>false</c>.</returns>
        Task<bool> IsUserCeoAsync(int userId);
    }
}
