using Microsoft.EntityFrameworkCore;
using NokAir.Core.Abstractions.Entities.Rbac;
using NokAir.TalkToCeo.Shared.Dtos;
using NokAir.TalkToCeo.Shared.Entities.Common;

namespace NokAir.TalkToCeo.Shared.Repositories
{
    /// <summary>
    /// Implements the IUsersRepository interface for managing users in the application. This repository provides methods for adding a user and finding a user by specific criteria. The UsersRepository class interacts with the TalkToCeoDbContext to perform database operations related to users, ensuring that data is stored and retrieved efficiently while adhering to the defined contract of the IUsersRepository interface.
    /// </summary>
    public class UsersRepository : IUsersRepository<UserDto>
    {
        private readonly TalkToCeoDbContext dbContext;

        /// <summary>
        /// Initializes a new instance of the <see cref="UsersRepository"/> class with the specified TalkToCeoDbContext. The constructor takes a TalkToCeoDbContext as a parameter and assigns it to a private readonly field, allowing the repository to interact with the database context for performing operations related to users. This setup enables the repository to manage user data effectively while maintaining a clear separation of concerns between the data access layer and the business logic layer of the application.
        /// </summary>
        /// <param name="context">The TalkToCeoDbContext instance used for database operations.</param>
        public UsersRepository(TalkToCeoDbContext context)
        {
            this.dbContext = context;
        }

        /// <inheritdoc/>
        public async Task AddUserAsync(User user, CancellationToken cancellationToken = default)
        {
            this.dbContext.User.Add(user);
            await this.dbContext.SaveChangesAsync(cancellationToken);
        }

        /// <inheritdoc/>
        public async Task<UserDto> AddUserAsync(UserDto user, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        /// <inheritdoc/>
        public async Task<int> FindUserCountAsync()
        {
            return await this.dbContext.User.CountAsync();
        }

        /// <inheritdoc/>
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

        /// <inheritdoc/>
        public async Task<UserDto?> FindUserByEmailAsync(string email, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        /// <inheritdoc/>
        public async Task<UserDto?> FindUserByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        /// <inheritdoc/>
        public async Task<int> UpdateUserAsync(UserDto user, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }
    }
}
