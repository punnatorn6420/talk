using System;
using NokAir.Core.Domain.Entities.InHouse;
using NokAir.TalkToCeo.Shared.Entities.TalkToCeo;
using NokAir.TalkToCeo.Shared.QueryModels.Broadcast;

namespace NokAir.TalkToCeo.Shared.Repositories
{
    /// <summary>
    /// Defines the contract for the broadcast repository in the TalkToCeo application. This repository is responsible for managing the persistence of broadcast messages, including creating new broadcasts. The interface currently includes a method for creating a broadcast, which takes a BroadcastMessage entity as a parameter. Implementations of this interface will provide the actual data access logic for handling broadcast messages, allowing for separation of concerns and easier maintenance of the codebase.
    /// </summary>
    public interface IBroadcastRepository
    {
        /// <summary>
        /// Creates a new broadcast message in the repository. This method takes a BroadcastMessage entity as input and is responsible for saving it to the underlying data store. The implementation of this method will handle the specifics of how the broadcast message is persisted, such as using an ORM or direct database access. This allows for flexibility in how the data is stored while keeping the business logic separate from the data access logic.
        /// </summary>
        /// <param name="entity">The broadcast message entity to be created.</param>
        /// <returns>A task that represents the asynchronous operation.</returns>
        Task AddBroadcastMessageAsync(BroadcastMessages entity);

        /// <summary>
        /// Retrieves a broadcast message by its unique identifier. This method takes an integer ID as input and returns the corresponding BroadcastMessage entity from the repository. The implementation of this method will handle the specifics of how the data is retrieved from the underlying data store, allowing for separation of concerns and easier maintenance of the codebase.
        /// </summary>
        /// <param name="id">The unique identifier of the broadcast message.</param>
        /// <returns>The broadcast message entity with the specified ID.</returns>
        Task<BroadcastMessages?> FindBroadcastMessageByIdAsync(int id);

        /// <summary>
        /// Deletes a broadcast message from the repository. This method takes a BroadcastMessage entity as input and is responsible for removing it from the underlying data store. The implementation of this method will handle the specifics of how the broadcast message is deleted, allowing for separation of concerns and easier maintenance of the codebase.
        /// </summary>
        /// <param name="entity">The broadcast message entity to be deleted.</param>
        /// <returns>A task that represents the asynchronous operation.</returns>
        Task RemoveBroadcastMessageAsync(BroadcastMessages entity);

        /// <summary>
        /// Retrieves the list of readers for a specific broadcast message. This method takes the ID of the broadcast message as input and returns a list of BroadcastMessageRead objects representing the readers of that broadcast. The implementation of this method will handle the specifics of how the data is retrieved from the underlying data store, allowing for separation of concerns and easier maintenance of the codebase.
        /// </summary>
        /// <param name="broadcastId">The unique identifier of the broadcast message.</param>
        /// <returns>A list of BroadcastMessageRead objects representing the readers of the broadcast message.</returns>
        Task<List<BroadcastMessageRead>> FindBroadcastReadMessagesAsync(int broadcastId);

        /// <summary>
        /// Counts the number of readers for a specific broadcast message. This method takes the ID of the broadcast message as input and returns the total count of readers who have read that broadcast. The implementation of this method will handle the specifics of how the data is retrieved and counted from the underlying data store, allowing for separation of concerns and easier maintenance of the codebase.
        /// </summary>
        /// <param name="broadcastId">The unique identifier of the broadcast message.</param>
        /// <returns>The total count of readers who have read the broadcast message.</returns>
        Task<int> FindCountReadersAsync(int broadcastId);

        /// <summary>
        /// Retrieves the timestamp of when the broadcast message was last read by any user. This method takes the ID of the broadcast message as input and returns the DateTime of the last read event. The implementation of this method will handle the specifics of how the data is retrieved from the underlying data store, allowing for separation of concerns and easier maintenance of the codebase.
        /// </summary>
        /// <param name="broadcastId">The unique identifier of the broadcast message.</param>
        /// <returns>The DateTime of the last read event for the broadcast message, or null if it has not been read.</returns>
        Task<DateTime?> FindGetLastReadAtAsync(int broadcastId);

        /// <summary>
        /// Retrieves a paginated list of broadcast messages based on the specified search criteria. This method takes various parameters for filtering, sorting, and paginating the results, including a keyword for searching, the field to sort by, pagination details (page number and page size), sorting order (ascending or descending), optional date range for filtering broadcasts, and the ID of the CEO. Implementations of this method should ensure that the specified CEO has the necessary permissions to view the broadcasts before performing the retrieval operation. Proper error handling should be implemented to manage cases where the CEO does not have permission to view the broadcasts or when invalid search criteria are provided.
        /// </summary>
        /// <param name="keyword">The keyword to search for in broadcast messages.</param>
        /// <param name="sortField">The field by which to sort the broadcast messages.</param>
        /// <param name="pageNumber">The page number for pagination.</param>
        /// <param name="pageSize">The number of items per page for pagination.</param>
        /// <param name="ascending">Indicates whether the sorting should be in ascending order.</param>
        /// <param name="searchStartDate">The start date for filtering broadcasts.</param>
        /// <param name="searchEndDate">The end date for filtering broadcasts.</param>
        /// <param name="ceoId">The ID of the CEO attempting to view the broadcasts.</param>
        /// <returns>A task representing the asynchronous operation, containing a paginated list of broadcast messages.</returns>
        Task<PagedResult<BroadcastMessages>> FindBroadcastsAsync(
            string keyword,
            string sortField,
            int pageNumber,
            int pageSize,
            bool ascending,
            DateTimeOffset? searchStartDate,
            DateTimeOffset? searchEndDate,
            int ceoId);

        /// <summary>
        /// Retrieves the list of broadcast messages for a specific user. This method takes the ID of the user as a parameter and returns a list of broadcast messages that are relevant to that user. Implementations of this method should ensure that the specified user exists and has the necessary permissions to view the broadcasts before performing the retrieval operation. Proper error handling should be implemented to manage cases where the user does not exist or does not have permission to view the broadcasts.
        /// </summary>
        /// <param name="userId">The ID of the user attempting to view the broadcasts.</param>
        /// <returns>A task representing the asynchronous operation, containing a list of broadcast messages.</returns>
        Task<List<MyBroadcastQueryResult>> FindVisibleBroadcastsAsync(int userId);

        /// <summary>
        /// Checks if a specific user has read a particular broadcast message. This method takes the ID of the broadcast message and the ID of the user as parameters. Implementations of this method should ensure that the specified broadcast message exists and that the user has the necessary permissions to view the read status before performing the check. Proper error handling should be implemented to manage cases where the broadcast message does not exist or the user does not have permission to view the read status.
        /// </summary>
        /// <param name="broadcastId">The ID of the broadcast message to check.</param>
        /// <param name="userId">The ID of the user to check.</param>
        /// <returns>A task representing the asynchronous operation, containing a boolean indicating whether the user has read the broadcast message.</returns>
        Task<bool> FindCheckUserReadStatusAsync(int broadcastId, int userId);

        /// <summary>
        /// Inserts a new read record for a specific broadcast message and user. This method takes the ID of the broadcast message, the ID of the user, and the timestamp of when the message was read as parameters. Implementations of this method should ensure that the specified broadcast message exists and that the user has the necessary permissions to update the read status before performing the insertion operation. Proper error handling should be implemented to manage cases where the broadcast message does not exist or the user does not have permission to update the read status.
        /// </summary>
        /// <param name="broadcastId">The ID of the broadcast message to mark as read.</param>
        /// <param name="userId">The ID of the user who read the broadcast message.</param>
        /// <param name="readAt">The timestamp indicating when the broadcast message was read.</param>
        /// <returns>A task representing the asynchronous operation.</returns>
        Task AddBroadcastReadEntryAsync(int broadcastId, int userId, DateTime readAt);

        /// <summary>
        /// Updates an existing broadcast message in the repository. This method takes a BroadcastMessage entity as input and is responsible for updating the corresponding record in the underlying data store. The implementation of this method will handle the specifics of how the broadcast message is updated, such as using an ORM or direct database access. This allows for flexibility in how the data is stored while keeping the business logic separate from the data access logic.
        /// </summary>
        /// <param name="entity">The broadcast message entity to update.</param>
        /// <returns>A task representing the asynchronous operation.</returns>
        Task UpdateAsync(BroadcastMessages entity);
    }
}
