using System;
using NokAir.TalkToCeo.Shared.Entities.TalkToCeo;

namespace NokAir.TalkToCeo.Shared.Repositories
{
    /// <summary>
    /// Defines the contract for a repository that manages message attachments in the TalkToCeo system.
    /// </summary>
    public interface IMessageAttachmentRepository
    {
        /// <summary>
        /// Adds a list of message attachments to the repository.
        /// </summary>
        /// <param name="attachments">The list of message attachments to add.</param>
        /// <returns>A task representing the asynchronous operation.</returns>
        Task AddRangeAsync(List<MessageAttachment> attachments);

        /// <summary>
        /// Gets a message attachment by its ID.
        /// </summary>
        /// <param name="id">The ID of the message attachment.</param>
        /// <returns>The message attachment if found; otherwise, null.</returns>
        Task<MessageAttachment?> FindAttachmentByIdAsync(int id);

        /// <summary>
        /// Gets attachments by message ID.
        /// </summary>
        /// <param name="messageId">The message ID.</param>
        /// <returns>The list of attachments.</returns>
        Task<List<MessageAttachment>> FindAttachmentsByMessageIdAsync(int messageId);
    }
}
