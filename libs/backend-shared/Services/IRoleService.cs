using System;
using NokAir.Core.Abstractions.Services.Rbac;
using NokAir.TalkToCeo.Shared.Dtos;

namespace NokAir.TalkToCeo.Shared.Services
{
    /// <summary>
    /// Represents a service for managing roles in the application. This interface extends the base role service interface and provides additional functionality specific to the application's requirements, such as retrieving a list of roles asynchronously.
    /// </summary>
    public interface IRoleService : IRoleServiceBase
    {
        /// <summary>
        /// Asynchronously retrieves the list of roles.
        /// </summary>
        /// <param name="cancellationToken">A token to cancel the operation.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a list of <see cref="RoleDto"/>.</returns>
        Task<List<RoleDto>> GetRolesAsync(CancellationToken cancellationToken = default);
    }
}
