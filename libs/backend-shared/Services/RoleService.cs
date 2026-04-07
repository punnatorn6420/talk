using System;
using NokAir.TalkToCeo.Shared.Dtos;
using NokAir.TalkToCeo.Shared.Entities.Common;
using NokAir.TalkToCeo.Shared.Repositories;

namespace NokAir.TalkToCeo.Shared.Services
{
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
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<bool> IsUserInRoleAsync(int userId, string requiredRole, CancellationToken cancellationToken = default)
        {
            return await this.roleRepository.ExistsUserInRoleAsync(userId, requiredRole, cancellationToken);
        }

        public async Task<bool> IsUserInRolesAsync(int userId, string[] requiredRoles, CancellationToken cancellationToken = default)
        {
            return await this.roleRepository.ExistsUserInRolesAsync(userId, requiredRoles, cancellationToken);
        }
    }
}
