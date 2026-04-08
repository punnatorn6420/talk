using System;
using System.Globalization;
using System.Security.Cryptography.X509Certificates;
using Microsoft.EntityFrameworkCore;
using NokAir.Core.Domain.Entities.InHouse;
using NokAir.TalkToCeo.Shared.Entities.TalkToCeo;
using NokAir.TalkToCeo.Shared.Enums;

namespace NokAir.TalkToCeo.Shared.Repositories
{
    /// <summary>
    /// Implements the IMessageRepository interface for managing messages in the "Talk to CEO" system. This repository provides methods for adding, retrieving, updating, and deleting messages, as well as searching for messages based on specific criteria. The MessageRepository class interacts with the TalkToCeoDbContext to perform database operations related to messages, ensuring that data is stored and retrieved efficiently while adhering to the defined contract of the IMessageRepository interface.
    /// </summary>
    public class MessageRepository : IMessageRepository
    {
        private readonly TalkToCeoDbContext dbContext;

        /// <summary>
        /// Initializes a new instance of the <see cref="MessageRepository"/> class with the specified TalkToCeoDbContext. The constructor takes a TalkToCeoDbContext as a parameter and assigns it to a private readonly field, allowing the repository to interact with the database context for performing operations related to messages. This setup enables the repository to manage message data effectively while maintaining a clear separation of concerns between the data access layer and the business logic layer of the application.
        /// </summary>
        /// <param name="dbContext">The TalkToCeoDbContext instance used for database operations.</param>
        public MessageRepository(TalkToCeoDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        /// <inheritdoc/>
        public async Task<Messages> AddMessageAsync(Messages message)
        {
            this.dbContext.Messages.Add(message);

            await this.dbContext.SaveChangesAsync();

            return message;
        }

        /// <inheritdoc/>
        public async Task RemoveMessageAsync(Messages message)
        {
            this.dbContext.Messages.Remove(message);

            await this.dbContext.SaveChangesAsync();
        }

        /// <inheritdoc/>
        public async Task<List<Messages>> FindMessagesListAsync()
        {
            return await this.dbContext.Messages.ToListAsync();
        }

        /// <inheritdoc/>
        public async Task<Messages?> FindMessageByIdAsync(int id)
        {
            return await this.dbContext.Messages
                .Include(x => x.User)
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        /// <inheritdoc/>
        public async Task UpdateAsync(Messages message)
        {
            await this.dbContext.SaveChangesAsync();
        }

        /// <inheritdoc/>
        public async Task<PagedResult<Messages>> FindMessagesCriteriaAsync(
            string keyword,
            string sortField,
            int pageNumber,
            int pageSize,
            bool ascending,
            bool excludeDraft,
            string userIdFilter,
            bool isCeo,
            DateTimeOffset? searchStartDate,
            DateTimeOffset? searchEndDate)
        {
            var query = this.dbContext.Messages
                .Include(x => x.User)
                .AsQueryable();

            // keyword search
            if (!string.IsNullOrWhiteSpace(keyword))
            {
                query = query.Where(x =>
                    EF.Functions.ILike(x.Subject, $"%{keyword}%") ||
                    EF.Functions.ILike(x.Detail, $"%{keyword}%") ||
                    EF.Functions.ILike(x.User.FirstName, $"%{keyword}%") ||
                    EF.Functions.ILike(x.User.LastName, $"%{keyword}%"));
            }

            // date filter
            if (searchStartDate.HasValue)
            {
                query = query.Where(x => x.PostedAt >= searchStartDate.Value);
            }

            if (searchEndDate.HasValue)
            {
                query = query.Where(x => x.PostedAt <= searchEndDate.Value);
            }

            // filter ตาม user เฉพาะกรณีไม่ใช่ CEO
            if (!isCeo && !string.IsNullOrWhiteSpace(userIdFilter))
            {
                query = query.Where(x =>
                    x.UserId == int.Parse(userIdFilter, CultureInfo.InvariantCulture));
            }

            if (excludeDraft)
            {
                query = query.Where(x => x.Status != ActionStatus.Draft);
            }

            // นับทั้งหมดก่อน pagination
            var totalCount = await query.CountAsync();

            // sorting
            query = sortField?.ToLower(CultureInfo.InvariantCulture) switch
            {
                "subject" => ascending ? query.OrderBy(x => x.Subject) : query.OrderByDescending(x => x.Subject),
                "postedat" => ascending ? query.OrderBy(x => x.PostedAt) : query.OrderByDescending(x => x.PostedAt),
                _ => query.OrderByDescending(x => x.Id),
            };

            // paging
            var items = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResult<Messages>
            {
                Items = items,
                TotalCount = totalCount,
            };
        }
    }
}
