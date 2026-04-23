using System;
using Microsoft.EntityFrameworkCore;
using NokAir.TalkToCeo.Shared.Entities.TalkToCeo;

namespace NokAir.TalkToCeo.Shared.Repositories
{
    /// <summary>
    /// Implements the broadcast attachment repository for the TalkToCeo application. This repository is responsible for managing the persistence of broadcast message attachments, including retrieving attachments associated with specific broadcast messages. The BroadcastAttachmentRepository class implements the IBroadcastAttachmentRepository interface, providing the actual data access logic for handling broadcast message attachments. The FindAttachmentsByBroadcastIdAsync method will handle the specifics of how the attachments are retrieved based on the broadcast ID, such as using an ORM or direct database access. This allows for flexibility in how the data is accessed while keeping the business logic separate from the data access logic.
    /// </summary>
    public class BroadcastAttachmentRepository : IBroadcastAttachmentRepository
    {
        private readonly TalkToCeoDbContext dbContext;

        /// <summary>
        /// Initializes a new instance of the <see cref="BroadcastAttachmentRepository"/> class with the specified database context. The constructor takes a <see cref="TalkToCeoDbContext"/> as a parameter, which is used to interact with the underlying data store for managing broadcast message attachments. This allows the repository to perform operations such as retrieving attachments based on the broadcast ID and saving changes to the database. By injecting the database context through the constructor, we can easily manage dependencies and promote better testability of the repository class.
        /// </summary>
        /// <param name="dbContext">The database context used to interact with the underlying data store.</param>
        public BroadcastAttachmentRepository(TalkToCeoDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        /// <inheritdoc/>
        public async Task AddRangeAsync(List<BroadcastMessageAttachment> attachments)
        {
            await this.dbContext
                .BroadcastMessageAttachments
                .AddRangeAsync(attachments);
        }

        /// <inheritdoc/>
        public async Task<BroadcastMessageAttachment?> FindAttachmentByIdAsync(int broadcastId, int attachmentId)
        {
            return await this.dbContext
                .BroadcastMessageAttachments
                .AsNoTracking()
                .FirstOrDefaultAsync(x =>
                    x.BroadcastMessageId == broadcastId &&
                    x.Id == attachmentId);
        }

        /// <inheritdoc/>
        public async Task<List<BroadcastMessageAttachment>> FindAttachmentsByBroadcastIdAsync(int broadcastId)
        {
            return await this.dbContext.BroadcastMessageAttachments
                .Where(x => x.BroadcastMessageId == broadcastId)
                .ToListAsync();
        }

        /// <inheritdoc/>
        public async Task<List<BroadcastMessageAttachment>> FindAttachmentsByBroadcastIdsAsync(List<int> broadcastIds)
        {
            return await this.dbContext
                .BroadcastMessageAttachments
                .AsNoTracking()
                .Where(x =>
                    broadcastIds.Contains(
                        x.BroadcastMessageId))
                .ToListAsync();
        }

        /// <inheritdoc/>
        public async Task RemoveBroadcastAttachmentAsync(BroadcastMessageAttachment attachment)
        {
            this.dbContext.BroadcastMessageAttachments.Remove(attachment);
            await this.dbContext.SaveChangesAsync();
        }
    }
}
