using Microsoft.EntityFrameworkCore;
using NokAir.Core.Abstractions.Entities.Rbac;
using NokAir.TalkToCeo.Shared.Dtos;
using NokAir.TalkToCeo.Shared.Entities.Common;

namespace NokAir.TalkToCeo.Shared.Repositories
{
    public class UsersRepository : IUsersRepository<UserDto>
    {
        private readonly TalkToCeoDbContext dbContext;

        public UsersRepository(TalkToCeoDbContext context)
        {
            this.dbContext = context;
        }

        public async Task AddUserAsync(User user, CancellationToken cancellationToken = default)
        {
            this.dbContext.User.Add(user);
            await this.dbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task<UserDto> AddUserAsync(UserDto user, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        public async Task<User?> FindUserByCriteriaAsync(string? email = null, string? firstname = null, string? lastname = null, string? objectId = null, CancellationToken cancellationToken = default)
        {
            IQueryable<User> query = this.dbContext.User;
            if (!string.IsNullOrEmpty(email))
            {
                query = query.Where(x => x.Email == email);
            }

            if (!string.IsNullOrEmpty(firstname))
            {
                query = query.Where(x => x.FirstName == firstname);
            }

            if (!string.IsNullOrEmpty(lastname))
            {
                query = query.Where(x => x.LastName == lastname);
            }

            if (!string.IsNullOrEmpty(objectId))
            {
                query = query.Where(x => x.ObjectId == objectId);
            }

            return await query.FirstOrDefaultAsync(cancellationToken);
        }

        public async Task<UserDto?> FindUserByEmailAsync(string email, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        public async Task<UserDto?> FindUserByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        public async Task<int> UpdateUserAsync(UserDto user, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }
    }
}
