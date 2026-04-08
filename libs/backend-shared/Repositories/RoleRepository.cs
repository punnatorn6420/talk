using Microsoft.EntityFrameworkCore;
using NokAir.Core.Abstractions.Entities.Rbac;
using NokAir.TalkToCeo.Shared.Entities.Common;

namespace NokAir.TalkToCeo.Shared.Repositories
{
    /// <summary>
    /// Implements the IRoleRepository interface for managing roles in the application. This repository provides methods for adding roles, checking if a user exists in a role, finding all roles, and other role-related operations. The RoleRepository class interacts with the TalkToCeoDbContext to perform database operations related to roles, ensuring that data is stored and retrieved efficiently while adhering to the defined contract of the IRoleRepository interface.
    /// </summary>
    public class RoleRepository : IRoleRepository<Role>
    {
        private readonly TalkToCeoDbContext dbContext;

        /// <summary>
        /// Initializes a new instance of the <see cref="RoleRepository"/> class with the specified TalkToCeoDbContext. The constructor takes a TalkToCeoDbContext as a parameter and assigns it to a private readonly field, allowing the repository to interact with the database context for performing operations related to roles. This setup enables the repository to manage role data effectively while maintaining a clear separation of concerns between the data access layer and the business logic layer of the application.
        /// </summary>
        /// <param name="dbContext">The TalkToCeoDbContext instance used for database operations.</param>
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
