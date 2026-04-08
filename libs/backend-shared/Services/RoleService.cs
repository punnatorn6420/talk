using System;
using NokAir.TalkToCeo.Shared.Dtos;
using NokAir.TalkToCeo.Shared.Entities.Common;
using NokAir.TalkToCeo.Shared.Repositories;

namespace NokAir.TalkToCeo.Shared.Services
{
    /// <summary>
    /// Represents a service for managing roles in the application. This class implements the <see cref="IRoleService"/> interface and provides functionality to retrieve a list of roles asynchronously, as well as check if a user belongs to specific roles. The service interacts with the underlying role repository to perform these operations, ensuring that role management is handled efficiently within the application.
    /// </summary>
    public class RoleService : IRoleService
    {
        private readonly IRoleRepository<Role> roleRepository;

        /// <summary>
        /// Initializes a new instance of the <see cref="RoleService"/> class with the specified role repository and logger.
        /// </summary>
        /// <param name="roleRepository">The role repository to be used by the service.</param>
        public RoleService(IRoleRepository<Role> roleRepository)
        {
            this.roleRepository = roleRepository;
        }

        /// <inheritdoc/>
        public async Task<List<RoleDto>> GetRolesAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                var roles = await this.roleRepository.FindAllAsync(cancellationToken);

                return roles.Select(role => new RoleDto
                {
                    Id = role.Id,
                    Name = role.Name,
                    Active = role.Active,
                    CreatedAt = role.CreatedAt,
                    LastUpdate = role.ModifiedAt,
                }).ToList();
            }
            catch (Exception)
            {
                throw;
            }
        }

        /// <inheritdoc/>
        public async Task<bool> IsUserInRoleAsync(int userId, string requiredRole, CancellationToken cancellationToken = default)
        {
            return await this.roleRepository.ExistsUserInRoleAsync(userId, requiredRole, cancellationToken);
        }

        /// <inheritdoc/>
        public async Task<bool> IsUserInRolesAsync(int userId, string[] requiredRoles, CancellationToken cancellationToken = default)
        {
            return await this.roleRepository.ExistsUserInRolesAsync(userId, requiredRoles, cancellationToken);
        }
    }
}
