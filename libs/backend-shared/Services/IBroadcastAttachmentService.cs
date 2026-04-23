using System;
using Microsoft.AspNetCore.Http;
using NokAir.TalkToCeo.Shared.Dtos;
using NokAir.TalkToCeo.Shared.Entities.TalkToCeo;

namespace NokAir.TalkToCeo.Shared.Services
{
    /// <summary>
    /// Defines the contract for a service that manages broadcast message attachments in the TalkToCeo system. This service is responsible for handling the storage of files associated with broadcast messages, allowing for efficient management of attachments while keeping the business logic separate from the data access logic. The IBroadcastAttachmentService interface defines a method for storing files as attachments for a specific broadcast message, taking into account the message ID, the collection of files to be uploaded, and user information for auditing purposes. Implementing this interface will allow for flexibility in how attachments are stored, such as using a file system or cloud storage, while providing a consistent API for managing broadcast message attachments.
    ///
    /// </summary>
    public interface IBroadcastAttachmentService
    {
        /// <summary>
        /// Stores a collection of files as attachments for a specific broadcast message and returns the list of file paths where the attachments are stored. This method takes the ID of the broadcast message, the collection of files to be uploaded, and user information for auditing purposes. The implementation of this method will handle the specifics of how the files are stored, such as saving them to a file system or cloud storage, and will return the paths where the attachments can be accessed. This allows for efficient management of broadcast message attachments while keeping the business logic separate from the data access logic.
        /// </summary>
        /// <param name="broadcastId">The ID of the broadcast message.</param>
        /// <param name="files">The collection of files to be uploaded as attachments.</param>
        /// <param name="user">The user information for auditing purposes.</param>
        /// <returns>A list of file paths where the attachments are stored.</returns>
        Task<List<string>> StoreFilesForBroadcastAsync(int broadcastId, IFormFileCollection files, UserDto user);

        /// <summary>
        /// Gets the download information for a specific attachment.
        /// </summary>
        /// <param name="broadcastId">The ID of the broadcast message to which the attachment belongs.</param>
        /// <param name="attachmentId">The ID of the attachment.</param>
        /// <returns>A task representing the asynchronous operation, containing the full path and file name of the attachment if found; otherwise, null.</returns>
        Task<(string FullPath, string FileName)?> GetDownloadFileAsync(int broadcastId, int attachmentId);

        /// <summary>
        /// Deletes a specific attachment associated with a broadcast message.
        /// </summary>
        /// <param name="broadcastId">The ID of the broadcast message to which the attachment belongs.</param>
        /// <param name="attachmentId">The ID of the attachment to be deleted.</param>
        /// <returns>A task representing the asynchronous operation.</returns>
        Task RemoveAttachmentAsync(int broadcastId, int attachmentId);
    }
}
