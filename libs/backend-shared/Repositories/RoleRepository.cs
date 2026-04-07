using Microsoft.EntityFrameworkCore;
using NokAir.Core.Abstractions.Entities.Rbac;
using NokAir.TalkToCeo.Shared.Entities.Common;

namespace NokAir.TalkToCeo.Shared.Repositories
{
    public class RoleRepository : IRoleRepository<Role>
    {
        private readonly TalkToCeoDbContext dbContext;

        public RoleRepository(TalkToCeoDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        /// <inheritdoc/>
        public async Task<Role> AddRoleAsync(Role role, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        /// <inheritdoc/>
        public async Task<bool> ExistsUserInRoleAsync(int userId, string requiredRole, CancellationToken cancellationToken = default)
        {
            return await this.dbContext.UserRole.AnyAsync(ur => ur.UserId == userId && ur.Role.Name == requiredRole, cancellationToken);
        }

        /// <inheritdoc/>
        public async Task<bool> ExistsUserInRolesAsync(int userId, string[] requiredRoles, CancellationToken cancellationToken = default)
        {
            var roles = requiredRoles.ToList();

            var count = await this.dbContext.UserRole.Where(ur => ur.UserId == userId && roles.Contains(ur.Role!.Name)).CountAsync(cancellationToken);

            return count > 0;
        }

        /// <inheritdoc/>
        public async Task<IEnumerable<Role>> FindAllAsync(CancellationToken cancellationToken = default)
        {
            return await Task.FromResult(this.dbContext.Roles.AsQueryable());
        }

        /// <inheritdoc/>
        public async Task<Role?> FindByIdAsync(int roleId, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        /// <inheritdoc/>
        public async Task<ICollection<Role>> FindRolesByCriteriaAsync(IRoleSearchCriteria searchCriteria, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        /// <inheritdoc/>
        public async Task<int> RemoveRoleByIdAsync(int roleId, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        /// <inheritdoc/>
        public async Task<int> UpdateRoleAsync(Role role, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }
    }
}
