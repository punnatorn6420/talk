using NokAir.Core.Abstractions.Services.Rbac;
using NokAir.TalkToCeo.Shared.Dtos;
using NokAir.TalkToCeo.Shared.Dtos.Common;

namespace NokAir.TalkToCeo.Shared.Services
{
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
    }
}
