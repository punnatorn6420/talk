using System;
using Microsoft.EntityFrameworkCore;
using NokAir.TalkToCeo.Shared.Entities.TalkToCeo;

namespace NokAir.TalkToCeo.Shared.Repositories
{
    /// <summary>
    /// Implements the IMessageAttachmentRepository interface to manage message attachments in the TalkToCeo system.
    /// </summary>
    public class MessageAttachmentRepository : IMessageAttachmentRepository
    {
        private readonly TalkToCeoDbContext dbContext;

        /// <summary>
        /// Initializes a new instance of the <see cref="MessageAttachmentRepository"/> class with the specified database context.
        /// </summary>
        /// <param name="dbContext">The database context to be used by the repository.</param>
        public MessageAttachmentRepository(
        TalkToCeoDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        /// <inheritdoc/>
        public async Task AddRangeAsync(List<MessageAttachment> attachments)
        {
            await this.dbContext.MessageAttachments.AddRangeAsync(attachments);
        }

        /// <inheritdoc/>
        public async Task RemoveMessageAttachmentAsync(MessageAttachment attachment)
        {
            this.dbContext.MessageAttachments.Remove(attachment);
            await this.dbContext.SaveChangesAsync();
        }

        /// <inheritdoc/>
        public async Task<MessageAttachment?> FindAttachmentByIdAsync(int messageId, int attachmentId)
        {
            return await this.dbContext.MessageAttachments.FirstOrDefaultAsync(x => x.MessageId == messageId && x.Id == attachmentId);
        }

        /// <inheritdoc/>
        public async Task<List<MessageAttachment>> FindAttachmentsByMessageIdAsync(int messageId)
        {
            return await this.dbContext.MessageAttachments
                .Where(x => x.MessageId == messageId)
                .ToListAsync();
        }

        /// <inheritdoc/>
        public async Task<List<MessageAttachment>> FindAttachmentsByMessageIdsAsync(List<int> messageIds)
        {
            return await this.dbContext.MessageAttachments
                .Where(x => messageIds.Contains(x.MessageId))
                .ToListAsync();
        }
    }
}
