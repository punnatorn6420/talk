using System;
using System.Globalization;
using Microsoft.EntityFrameworkCore;
using NokAir.Core.Domain.Entities.InHouse;
using NokAir.TalkToCeo.Shared.Entities.TalkToCeo;
using NokAir.TalkToCeo.Shared.Enums;
using NokAir.TalkToCeo.Shared.QueryModels.Broadcast;

namespace NokAir.TalkToCeo.Shared.Repositories
{
    /// <summary>
    /// Implements the broadcast repository for the TalkToCeo application. This repository is responsible for managing the persistence of broadcast messages, including creating new broadcasts. The BroadcastRepository class implements the IBroadcastRepository interface, providing the actual data access logic for handling broadcast messages. The CreateAsync method will handle the specifics of how the broadcast message is persisted, such as using an ORM or direct database access. This allows for flexibility in how the data is stored while keeping the business logic separate from the data access logic.
    /// </summary>
    public class BroadcastRepository : IBroadcastRepository
    {
        private readonly TalkToCeoDbContext dbContext;

        /// <summary>
        /// Initializes a new instance of the <see cref="BroadcastRepository"/> class with the specified database context. The constructor takes a <see cref="TalkToCeoDbContext"/> as a parameter, which is used to interact with the underlying data store for managing broadcast messages. This allows the repository to perform operations such as adding new broadcast messages and saving changes to the database. By injecting the database context through the constructor, we can easily manage dependencies and promote better testability of the repository class.
        /// </summary>
        /// <param name="dbContext">The database context used to interact with the underlying data store.</param>
        public BroadcastRepository(
            TalkToCeoDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        /// <inheritdoc/>
        public async Task<BroadcastMessages> AddBroadcastMessageAsync(BroadcastMessages entity)
        {
            await this.dbContext.BroadcastMessages.AddAsync(entity);
            await this.dbContext.SaveChangesAsync();
            return entity;
        }

        /// <inheritdoc/>
        public async Task RemoveBroadcastMessageAsync(BroadcastMessages entity)
        {
            this.dbContext.BroadcastMessages.Remove(entity);

            await this.dbContext.SaveChangesAsync();
        }

        /// <inheritdoc/>
        public async Task<BroadcastMessages?> FindBroadcastMessageByIdAsync(int id)
        {
            return await this.dbContext.BroadcastMessages
            .AsNoTracking()
            .Include(x => x.User)
                .FirstOrDefaultAsync(x =>
                    x.Id == id);
        }

        /// <inheritdoc/>
        public async Task<List<BroadcastMessageRead>> FindBroadcastReadMessagesAsync(int broadcastId)
        {
            return await this.dbContext.BroadcastMessageReads
                .AsNoTracking()
                .Include(x => x.User)
                .Where(x => x.BroadcastMessageId == broadcastId)
                .ToListAsync();
        }

        /// <inheritdoc/>
        public async Task<int> FindCountReadersAsync(int broadcastId)
        {
            return await this.dbContext.BroadcastMessageReads
                .AsNoTracking()
                .CountAsync(x => x.BroadcastMessageId == broadcastId);
        }

        /// <inheritdoc/>
        public async Task<DateTime?> FindGetLastReadAtAsync(int broadcastId)
        {
            return await this.dbContext.BroadcastMessageReads
                .AsNoTracking()
                .Where(x => x.BroadcastMessageId == broadcastId)
                .MaxAsync(x => (DateTime?)x.ReadAt);
        }

        /// <inheritdoc/>
        public async Task<PagedResult<BroadcastMessages>> FindBroadcastsAsync(
            string keyword,
            string sortField,
            int pageNumber,
            int pageSize,
            bool ascending,
            DateTimeOffset? searchStartDate,
            DateTimeOffset? searchEndDate,
            int ceoId)
        {
            var query = this.dbContext.BroadcastMessages
                .Include(x => x.User)
                .Where(x =>
                    x.CeoId == ceoId)
                .AsNoTracking()
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                query = query.Where(x =>
                    x.Subject.Contains(keyword) ||
                    x.Detail.Contains(keyword));
            }

            if (searchStartDate.HasValue)
            {
                query = query.Where(x =>
                    x.CreatedAt >= searchStartDate.Value.UtcDateTime);
            }

            if (searchEndDate.HasValue)
            {
                query = query.Where(x =>
                    x.CreatedAt <= searchEndDate.Value.UtcDateTime);
            }

            query = sortField?.ToLower(CultureInfo.InvariantCulture) switch
            {
                "subject" => ascending
                    ? query.OrderBy(x => x.Subject)
                    : query.OrderByDescending(x => x.Subject),

                "status" => ascending
                    ? query.OrderBy(x => x.Status)
                    : query.OrderByDescending(x => x.Status),

                "startdisplayat" => ascending
                    ? query.OrderBy(x => x.StartDisplayAt)
                    : query.OrderByDescending(x => x.StartDisplayAt),

                _ => query.OrderByDescending(x => x.CreatedAt),
            };

            var totalCount = await query.CountAsync();

            var items = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResult<BroadcastMessages>
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalCount = totalCount,
                Items = items,
            };
        }

        /// <inheritdoc/>
        public async Task<List<MyBroadcastQueryResult>> FindVisibleBroadcastsAsync(int userId)
        {
            var now = DateTime.Now;

            var query =
                from broadcast in this.dbContext.BroadcastMessages
                .AsNoTracking()
                .Include(x => x.User)
                join read in this.dbContext.BroadcastMessageReads
                    .Where(x => x.UserId == userId)
                on broadcast.Id equals read.BroadcastMessageId into readGroup
                from read in readGroup.DefaultIfEmpty()
                where
                    broadcast.Status == BroadcastStatus.Sent &&
                    (broadcast.StartDisplayAt <= now) &&
                    (broadcast.ExpireDisplayAt == null ||
                        broadcast.ExpireDisplayAt >= now)
                orderby
                    broadcast.StartDisplayAt descending,
                    broadcast.CreatedAt descending
                select new MyBroadcastQueryResult
                {
                    Id = broadcast.Id,
                    Subject = broadcast.Subject,
                    Detail = broadcast.Detail,
                    Status = broadcast.Status,
                    StartDisplayAt = broadcast.StartDisplayAt,
                    ExpireDisplayAt = broadcast.ExpireDisplayAt,
                    CreatedAt = broadcast.CreatedAt,
                    Ceo = broadcast.User,
                    ReadAt = read.ReadAt,
                    ModifiedAt = broadcast.ModifiedAt,
                    ModifiedBy = broadcast.ModifiedBy,
                };

            return await query.ToListAsync();
        }

        /// <inheritdoc/>
        public async Task<bool> FindCheckUserReadStatusAsync(int broadcastId, int userId)
        {
            return await this.dbContext.BroadcastMessageReads
                .AnyAsync(x =>
                    x.BroadcastMessageId == broadcastId &&
                    x.UserId == userId);
        }

        /// <inheritdoc/>
        public async Task AddBroadcastReadEntryAsync(int broadcastId, int userId, DateTime readAt)
        {
            var entity = new BroadcastMessageRead
            {
                BroadcastMessageId = broadcastId,
                UserId = userId,
                ReadAt = readAt,
            };

            this.dbContext.BroadcastMessageReads.Add(entity);

            await this.dbContext.SaveChangesAsync();
        }

        /// <inheritdoc/>
        public async Task UpdateAsync(BroadcastMessages entity)
        {
            this.dbContext.BroadcastMessages.Update(entity);

            await this.dbContext.SaveChangesAsync();
        }

        /// <inheritdoc/>
        public async Task<BroadcastMessages?> FindBroadcastByIdAsync(int id)
        {
            return await this.dbContext.BroadcastMessages
            .AsNoTracking()
                .Include(x => x.Reads)
                .Include(x => x.Attachments)
                .Include(x => x.User)
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        /// <inheritdoc/>
        public async Task<BroadcastMessages?> FindBroadcastForUpdateAsync(int id)
        {
            return await this.dbContext
                .BroadcastMessages
                .FirstOrDefaultAsync(x => x.Id == id);
        }
    }
}
