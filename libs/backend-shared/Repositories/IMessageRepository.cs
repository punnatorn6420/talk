using System;
using NokAir.TalkToCeo.Shared.Entities.TalkToCeo;

namespace NokAir.TalkToCeo.Shared.Repositories
{
    /// <summary>
    /// Defines the contract for a message repository in the "Talk to CEO" system. This interface outlines the methods for adding, retrieving, updating, and deleting messages, as well as searching for messages based on specific criteria. Implementing this interface allows for consistent data access and manipulation of messages within the application, enabling features such as message creation, retrieval by ID, listing all messages, updating existing messages, and filtering messages based on various parameters.
    /// </summary>
    public interface IMessageRepository
    {
        /// <summary>
        /// Asynchronously creates a new message in the repository. The method takes a Message object as a parameter and returns the created Message object. This allows for the creation of new messages in the repository, which can then be retrieved, updated, or deleted as needed.
        /// </summary>
        /// <param name="message">The message to be added to the repository.</param>
        /// <returns>The created message.</returns>
        Task<Messages> AddMessageAsync(Messages message);

        /// <summary>
        /// Asynchronously retrieves a message from the repository by its unique identifier. The method takes an integer id as a parameter and returns a Message object if found, or null if no message with the specified id exists. This allows for the retrieval of specific messages from the repository based on their unique identifiers, enabling features such as viewing message details or performing operations on specific messages.
        /// </summary>
        /// <param name="id">The unique identifier of the message to retrieve.</param>
        /// <returns>The message with the specified id, or null if not found.</returns>
        Task<Messages?> FindMessageByIdAsync(int id);

        /// <summary>
        /// Asynchronously retrieves all messages from the repository. The method returns a list of Message objects, allowing for the retrieval of all messages stored in the repository. This can be useful for features such as displaying a list of messages to users or performing operations on multiple messages at once.
        /// </summary>
        /// <returns>A list of all messages in the repository.</returns>
        Task<List<Messages>> FindMessagesListAsync();

        /// <summary>
        /// Asynchronously updates an existing message in the repository. The method takes a Message object as a parameter and updates the corresponding message in the repository with the new information provided in the Message object. This allows for the modification of existing messages in the repository, enabling features such as editing message details or updating message status.
        /// </summary>
        /// <param name="message">The message to be updated in the repository.</param>
        /// <returns>A task representing the asynchronous operation.</returns>
        Task UpdateAsync(Messages message);

        /// <summary>
        /// Asynchronously deletes a message from the repository. The method takes a Message object as a
        /// parameter and removes the corresponding message from the repository. This allows for the removal of messages from the repository, enabling features such as deleting messages that are no longer needed or removing inappropriate content.
        /// </summary>
        /// <param name="message">The message to be removed from the repository.</param>
        /// <returns>A task representing the asynchronous operation.</returns>
        Task RemoveMessageAsync(Messages message);

        /// <summary>
        /// Asynchronously retrieves a list of messages from the repository based on specified criteria. The method takes several parameters, including a keyword for searching messages, sorting options, pagination details, and optional date filters. It returns a list of Message objects that match the specified criteria, allowing for the retrieval of messages that meet certain conditions or fall within specific date ranges. This can be useful for features such as searching for messages, displaying sorted lists of messages, or implementing pagination for large sets of messages.
        /// </summary>
        /// <param name="keyword">The keyword to search for in message subjects and details.</param>
        /// <param name="sortField">The field by which to sort the messages.</param>
        /// <param name="pageNumber">The page number for pagination.</param>
        /// <param name="pageSize">The number of messages to return per page.</param>
        /// <param name="ascending">Indicates whether the sorting should be in ascending order.</param>
        /// <param name="excludeDraft">Indicates whether to exclude draft messages from the results.</param>
        /// <param name="searchStartDate">The start date for filtering messages.</param>
        /// <param name="searchEndDate">The end date for filtering messages.</param>
        /// <returns>A list of messages that match the specified criteria.</returns>
        /// <param name="userIdFilter">Optional filter to retrieve messages for a specific user.</param>
        Task<List<Messages>> FindMessagesCriteriaAsync(
            string keyword,
            string sortField,
            int pageNumber,
            int pageSize,
            bool ascending,
            bool excludeDraft,
            DateTimeOffset? searchStartDate,
            DateTimeOffset? searchEndDate,
            string? userIdFilter);
    }
}
