using System.IdentityModel.Tokens.Jwt;
using NokAir.Core.Exceptions;
using NokAir.TalkToCeo.Shared.Dtos;
using NokAir.TalkToCeo.Shared.Dtos.Common;
using NokAir.TalkToCeo.Shared.Entities.Common;
using NokAir.TalkToCeo.Shared.Repositories;

namespace NokAir.TalkToCeo.Shared.Services
{
    public class UsersService : IUsersService<UserDto>
    {
        private readonly IUsersRepository<UserDto> usersRepository;
        private readonly IRoleRepository<Role> roleRepository;
        private readonly IUserRoleRepository userRoleRepository;
        private readonly TalkToCeoDbContext dbContext;

        public UsersService(
            IUsersRepository<UserDto> usersRepository,
            IRoleRepository<Role> roleRepository,
            IUserRoleRepository userRoleRepository,
            TalkToCeoDbContext dbContext)
        {
            this.usersRepository = usersRepository;
            this.roleRepository = roleRepository;
            this.userRoleRepository = userRoleRepository;
            this.dbContext = dbContext;
        }

        public async Task AddUserAsync(AddUserFromPotal user, CancellationToken cancellationToken = default)
        {
            await using var dbTransaction = await this.dbContext.Database.BeginTransactionAsync(cancellationToken);
            try
            {
                int userId = Convert.ToInt32(user.Id);
                string objectId = user.ObjectId ?? string.Empty;
                string email = user.Email ?? string.Empty;
                string firstName = user.FirstName ?? string.Empty;
                string lastName = user.LastName ?? string.Empty;
                string jobTitle = user.JobTitle ?? string.Empty;
                string department = user.Department ?? string.Empty;
                bool isActive = bool.TryParse(user.Active.ToString().ToLowerInvariant(), out var parsedActive) && parsedActive;

                var roleIds = user.Roles ?? Array.Empty<int>();

                // ตรวจสอบว่ามีผู้ใช้อยู่แล้วหรือไม่
                var existingUser = await this.usersRepository.FindUserByCriteriaAsync(email, firstName, lastName, objectId, cancellationToken);

                if (existingUser == null)
                {
                    var newUser = new User
                    {
                        Id = userId,
                        ObjectId = objectId,
                        FirstName = firstName,
                        LastName = lastName,
                        Email = email,
                        JobTitle = jobTitle,
                        Department = department,
                        Active = isActive,
                    };

                    await this.usersRepository.AddUserAsync(newUser, cancellationToken);
                }

                // ล้าง roles เดิมแล้วเพิ่ม roles ใหม่ (ถ้ามี)
                if (!string.IsNullOrWhiteSpace(objectId) && roleIds.Length > 0)
                {
                    await this.userRoleRepository.AddUserRoleAsync(userId, roleIds, cancellationToken);
                }

                await dbTransaction.CommitAsync(cancellationToken);
            }
            catch
            {
                await dbTransaction.RollbackAsync(cancellationToken);
                throw;
            }
        }

        public Task<UserDto> AddUserAsync(UserDto user, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        public Task<UserDto?> GetUserByEmailAsync(string email, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        public Task<UserDto?> GetUserByIdAsync(int userId, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        public async Task<UserDto?> GetUserFromTokenAsync(string token, CancellationToken cancellationToken = default)
        {
            try
            {
                var handler = new JwtSecurityTokenHandler();
                var jwtToken = handler.ReadJwtToken(token);

                // ดึง email จาก claim ทั่วไป
                var email = jwtToken.Claims.FirstOrDefault(c => c.Type == "Email")?.Value ?? jwtToken.Claims.FirstOrDefault(c => c.Type == "email")?.Value;
                if (string.IsNullOrEmpty(email))
                {
                    throw new DataValidationException("Missing email claim in token.");
                }

                // ดึงชื่อผู้ใช้ (สมมติมี claim ชื่อ "name" หรือ "preferred_username")
                var userName = jwtToken.Claims.FirstOrDefault(c => c.Type == "unique_name")?.Value
                            ?? jwtToken.Claims.FirstOrDefault(c => c.Type == "UserName")?.Value;

                if (string.IsNullOrEmpty(userName))
                {
                    throw new DataValidationException("Missing user name claim in token.");
                }

                // แยกชื่อและนามสกุล (ถ้ามี)
                var nameParts = userName.Split(' ', 2);
                var firstName = nameParts.ElementAtOrDefault(0) ?? string.Empty;
                var lastName = nameParts.ElementAtOrDefault(1) ?? string.Empty;

                // ค้นหาผู้ใช้ในระบบจาก email, firstName, lastName
                var user = await this.usersRepository.FindUserByCriteriaAsync(email, firstName, lastName, null, cancellationToken);
                if (user == null)
                {
                    return null;
                }

                var userRoleIds = await this.userRoleRepository.FindUserRolesByUserIdAsync(user.Id, cancellationToken);
                var userRoleIdList = userRoleIds.Select(r => r.RoleId).ToList();

                var allRoles = await this.roleRepository.FindAllAsync(cancellationToken);

                var matchedRoles = allRoles
                    .Where(r => userRoleIdList.Contains(r.Id))
                    .ToList();

                var roleNames = matchedRoles.Select(r => r.Name).ToList();

                return new UserDto
                {
                    Id = user.Id,
                    ObjectId = user.ObjectId,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    JobTitle = user.JobTitle,
                    Department = user.Department,
                    Active = user.Active,
                    Roles = roleNames,
                    CreatedAt = user.CreatedAt,
                    ModifiedAt = user.ModifiedAt,
                };
            }
            catch (DataValidationException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public Task<bool> UpdateUserAsync(UserDto user, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }
    }
}
