using System;
using NokAir.TalkToCeo.Shared.Entities.TalkToCeo;

namespace NokAir.TalkToCeo.Shared.Repositories
{
    /// <summary>
    /// Defines the contract for the broadcast attachment repository in the TalkToCeo application. This repository is responsible for managing the persistence of broadcast message attachments, including retrieving attachments associated with specific broadcast messages. The interface currently includes a method for finding attachments by broadcast ID, which takes the ID of the broadcast message as a parameter and returns a list of BroadcastMessageAttachment entities that are associated with the given broadcast ID. Implementations of this interface will provide the actual data access logic for handling broadcast message attachments, allowing for separation of concerns and easier maintenance of the codebase.
    /// </summary>
    public interface IBroadcastAttachmentRepository
    {
        /// <summary>
        /// Finds a list of broadcast message attachments by the specified broadcast ID. This method takes the ID of the broadcast message as a parameter and returns a list of BroadcastMessageAttachment entities that are associated with the given broadcast ID. Implementations of this method should ensure that the specified broadcast ID is valid and that the attachments are retrieved efficiently from the data store, allowing for proper management and organization of attachments related to broadcast messages in the TalkToCeo application.
        ///
        /// </summary>
        /// <param name="broadcastId">The ID of the broadcast message for which to retrieve attachments.</param>
        /// <returns>A list of BroadcastMessageAttachment entities associated with the specified broadcast ID.</returns>
        Task<List<BroadcastMessageAttachment>> FindAttachmentsByBroadcastIdAsync(int broadcastId);

        /// <summary>
        /// Finds a specific broadcast message attachment by the given broadcast ID and attachment ID. This method takes the ID of the broadcast message and the ID of the attachment as parameters and returns a BroadcastMessageAttachment entity if found, or null if no matching attachment is found. Implementations of this method should ensure that both the broadcast ID and attachment ID are valid and that the retrieval process is efficient, allowing for proper management of individual attachments related to specific broadcast messages in the TalkToCeo application.
        /// </summary>
        /// <param name="broadcastId">The ID of the broadcast message to which the attachment belongs.</param>
        /// <param name="attachmentId">The ID of the attachment to retrieve.</param>
        /// <returns>A BroadcastMessageAttachment entity if found, or null if no matching attachment is found.</returns>
        Task<BroadcastMessageAttachment?> FindAttachmentByIdAsync(int broadcastId, int attachmentId);

        /// <summary>
        /// Removes a specific broadcast message attachment from the repository. This method takes a BroadcastMessageAttachment entity as a parameter and removes it from the data store. Implementations of this method should ensure that the specified attachment exists and is properly removed, allowing for efficient management of attachments related to broadcast messages in the TalkToCeo application.
        /// </summary>
        /// <param name="attachment">The BroadcastMessageAttachment entity to remove.</param>
        /// <returns>A task that represents the asynchronous operation.</returns>
        Task RemoveBroadcastAttachmentAsync(BroadcastMessageAttachment attachment);

        /// <summary>
        /// Adds a list of broadcast message attachments to the repository. This method takes a list of BroadcastMessageAttachment entities as a parameter and adds them to the data store. Implementations of this method should ensure that the specified attachments are valid and properly added, allowing for efficient management of attachments related to broadcast messages in the TalkToCeo application.
        /// </summary>
        /// <param name="attachments">The list of BroadcastMessageAttachment entities to add.</param>
        /// <returns>A task that represents the asynchronous operation.</returns>
        Task AddRangeAsync(List<BroadcastMessageAttachment> attachments);

        /// <summary>
        /// Finds the attachments associated with a list of broadcast message IDs. This method takes a list of broadcast message IDs as input and returns a list of attachments that are associated with those messages. The implementation of this method will handle the specifics of how the attachments are retrieved, such as querying a database or accessing a file system, and will return the relevant attachment information for each broadcast message ID provided. This allows for efficient retrieval of attachments related to specific broadcast messages while keeping the business logic separate from the data access logic.
        /// </summary>
        /// <param name="broadcastIds">The list of broadcast message IDs for which to retrieve attachments.</param>
        /// <returns>A task representing the asynchronous operation, containing a list of attachments associated with the specified broadcast message IDs.</returns>
        Task<List<BroadcastMessageAttachment>> FindAttachmentsByBroadcastIdsAsync(List<int> broadcastIds);
    }
}
