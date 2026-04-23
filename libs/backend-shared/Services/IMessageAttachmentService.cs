using System;
using Microsoft.AspNetCore.Http;
using NokAir.TalkToCeo.Shared.Dtos;
using NokAir.TalkToCeo.Shared.Enums;

namespace NokAir.TalkToCeo.Shared.Services
{
    /// <summary>
    /// Defines the contract for a service that manages message attachments in the TalkToCeo system.
    /// </summary>
    public interface IMessageAttachmentService
    {
        /// <summary>
        /// Uploads a collection of files as attachments for a specific message and returns the list of file paths where the attachments are stored.
        /// </summary>
        /// <param name="messageId">The ID of the message to which the attachments belong.</param>
        /// <param name="files">The collection of files to be uploaded as attachments.</param>
        /// <param name="userDto">The user information of the person uploading the attachments, used for auditing purposes.</param>
        /// <param name="ownerType">The type of owner for the attachment, indicating whether it belongs to a user message or a CEO reply.</param>
        /// <returns>A task representing the asynchronous operation, containing a list of file paths where the attachments are stored.</returns>
        Task<List<string>> StoreFilesForMessageAsync(int messageId, IFormFileCollection files, UserDto userDto, AttachmentOwnerType ownerType);

        /// <summary>
        /// Gets the download information for a specific attachment.
        /// </summary>
        /// <param name="messageId">The ID of the message to which the attachment belongs.</param>
        /// <param name="attachmentId">The ID of the attachment.</param>
        /// <returns>A task representing the asynchronous operation, containing the full path and file name of the attachment if found; otherwise, null.</returns>
        Task<(string FullPath, string FileName)?> GetDownloadFileAsync(int messageId, int attachmentId);

        /// <summary>
        /// Deletes a specific attachment associated with a message.
        /// </summary>
        /// <param name="messageId">The ID of the message to which the attachment belongs.</param>
        /// <param name="attachmentId">The ID of the attachment to be deleted.</param>
        /// <returns>A task representing the asynchronous operation.</returns>
        Task RemoveAttachmentAsync(int messageId, int attachmentId);
    }
}
