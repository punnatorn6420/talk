using Microsoft.EntityFrameworkCore;
using NokAir.TalkToCeo.Shared.Entities.Common;

namespace NokAir.TalkToCeo.Shared.Repositories
{
    public class UserRoleRepository : IUserRoleRepository
    {
        private readonly TalkToCeoDbContext dbContext;

        public UserRoleRepository(TalkToCeoDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

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
