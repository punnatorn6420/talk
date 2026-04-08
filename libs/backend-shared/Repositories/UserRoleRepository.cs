using Microsoft.EntityFrameworkCore;
using NokAir.TalkToCeo.Shared.Entities.Common;

namespace NokAir.TalkToCeo.Shared.Repositories
{
    /// <summary>
    /// Implements the IUserRoleRepository interface for managing user roles in the application. This repository provides methods for adding user roles and retrieving user roles based on user ID. The UserRoleRepository class interacts with the TalkToCeoDbContext to perform database operations related to user roles, ensuring that data is stored and retrieved efficiently while adhering to the defined contract of the IUserRoleRepository interface.
    /// </summary>
    public class UserRoleRepository : IUserRoleRepository
    {
        private readonly TalkToCeoDbContext dbContext;

        /// <summary>
        /// Initializes a new instance of the <see cref="UserRoleRepository"/> class with the specified TalkToCeoDbContext. The constructor takes a TalkToCeoDbContext as a parameter and assigns it to a private readonly field, allowing the repository to interact with the database context for performing operations related to user roles. This setup enables the repository to manage user role data effectively while maintaining a clear separation of concerns between the data access layer and the business logic layer of the application.
        /// </summary>
        /// <param name="dbContext">The TalkToCeoDbContext instance used for database operations.</param>
        public UserRoleRepository(TalkToCeoDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        /// <inheritdoc/>
        public async Task AddUserRoleAsync(int userId, int[] roleIds, CancellationToken cancellationToken = default)
        {
            // ดึง Role ทั้งหมดของ User นี้
            var existingRoles = await this.dbContext.UserRole
                .Where(ur => ur.UserId == userId)
                .ToListAsync(cancellationToken);

            // ลบ Role เดิมทั้งหมด
            if (existingRoles.Count != 0)
            {
                this.dbContext.UserRole.RemoveRange(existingRoles);
            }

            // สร้างรายการ Role ใหม่
            var newRoles = roleIds
                .Select(rid => new UserRole
                {
                    UserId = userId,
                    RoleId = rid,
                })
                .ToList();

            // เพิ่ม Role ใหม่
            if (newRoles.Count != 0)
            {
                this.dbContext.UserRole.AddRange(newRoles);
            }

            // บันทึกการเปลี่ยนแปลง
            await this.dbContext.SaveChangesAsync(cancellationToken);
        }

        /// <inheritdoc/>
        public async Task<List<UserRole>> FindUserRolesByUserIdAsync(int userId, CancellationToken cancellationToken = default)
        {
            var res = await this.dbContext.UserRole
                .Include(ur => ur.Role)
                .Where(ur => ur.UserId == userId)
                .ToListAsync(cancellationToken);

            return res;
        }
    }
}
