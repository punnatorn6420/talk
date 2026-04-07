using System;
using Microsoft.EntityFrameworkCore;
using NokAir.TalkToCeo.Shared.Entities.TalkToCeo;

namespace NokAir.TalkToCeo.Shared.Repositories
{
    public class MessageRepository : IMessageRepository
    {
        private readonly TalkToCeoDbContext dbContext;

        public MessageRepository(TalkToCeoDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        /// <inheritdoc/>
        public async Task<Messages> AddMessageAsync(Messages message)
        {
            dbContext.Messages.Add(message);

            await dbContext.SaveChangesAsync();

            return message;
        }

        /// <inheritdoc/>
        public async Task RemoveMessageAsync(Messages message)
        {
            dbContext.Messages.Remove(message);

            await dbContext.SaveChangesAsync();
        }

        /// <inheritdoc/>
        public async Task<List<Messages>> FindMessagesListAsync()
        {
            return await dbContext.Messages.ToListAsync();
        }

        /// <inheritdoc/>
        public async Task<Messages?> FindMessageByIdAsync(int id)
        {
            return await dbContext.Messages.FindAsync(id);
        }

        /// <inheritdoc/>
        public async Task UpdateAsync(Messages message)
        {
            await dbContext.SaveChangesAsync();
        }

        /// <inheritdoc/>
        public async Task<List<Messages>> FindMessagesCriteriaAsync(
            string keyword,
            string sortField,
            int pageNumber,
            int pageSize,
            bool ascending,
            DateTimeOffset? searchStartDate,
            DateTimeOffset? searchEndDate)
        {
            var query =
                dbContext.Messages.AsQueryable();

            // keyword search
            if (!string.IsNullOrWhiteSpace(keyword))
            {
                query =
                    query.Where(x =>
                        x.Subject.Contains(keyword) ||
                        x.Detail.Contains(keyword));
            }

            // date filter
            if (searchStartDate.HasValue)
            {
                query =
                    query.Where(x =>
                        x.PostedAt >= searchStartDate.Value);
            }

            if (searchEndDate.HasValue)
            {
                query =
                    query.Where(x =>
                        x.PostedAt <= searchEndDate.Value);
            }

            // sorting
            query =
                sortField?.ToLower() switch
                {
                    "subject" =>
                        ascending
                            ? query.OrderBy(x => x.Subject)
                            : query.OrderByDescending(x => x.Subject),

                    "postedat" =>
                        ascending
                            ? query.OrderBy(x => x.PostedAt)
                            : query.OrderByDescending(x => x.PostedAt),

                    _ =>
                        query.OrderByDescending(x => x.Id)
                };

            // paging
            query =
                query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize);

            return await query.ToListAsync();
        }
    }
}
