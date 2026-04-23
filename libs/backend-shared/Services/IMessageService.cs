using System;
using NokAir.TalkToCeo.Shared.Dtos;

namespace NokAir.TalkToCeo.Shared.Services
{
    /// <summary>
    /// Defines the contract for a service that manages messages in the "Talk to CEO" application. The IMessageService interface provides methods for creating, retrieving, updating, and deleting messages, as well as replying to messages and updating their read status. Additionally, it includes a method for retrieving messages based on specific criteria such as keyword search, sorting, pagination, and filtering by date range and user ID. Implementations of this interface are responsible for handling the business logic related to message management and ensuring that messages are processed and stored correctly within the application.
    /// </summary>
    public interface IMessageService
    {
        /// <summary>
        /// Asynchronously creates a new message based on the provided CreateMessageRequestDto. The method takes a CreateMessageRequestDto as a parameter, which contains the necessary information for creating a message, and returns a task representing the asynchronous operation. This allows for the creation of new messages in the "Talk to CEO" system, enabling users to submit their messages to the CEO or relevant parties.
        /// </summary>
        /// <param name="dto">The DTO containing the information required to create a new message.</param>
        /// <param name="user">The user creating the message.</param>
        /// <returns>A task representing the asynchronous operation.</returns>
        Task CreateAsync(CreateMessageRequestDto dto, UserDto user);

        /// <summary>
        /// Asynchronously retrieves all messages in the "Talk to CEO" system. The method returns a list of MessageResponseDto objects, which contain the details of each message. This allows for the retrieval of all messages stored in the system, enabling features such as displaying a list of messages to users or performing operations on multiple messages at once.
        /// </summary>
        /// <returns>A task that represents the asynchronous operation. The task result contains a list of MessageResponseDto objects.</returns>
        Task<List<MessageResponseDto>> GetAllAsync();

        /// <summary>
        /// Asynchronously retrieves a message by its unique identifier. The method takes an integer id as a parameter and returns a MessageResponseDto object if a message with the specified id exists; otherwise, it returns null. This allows for the retrieval of specific messages from the "Talk to CEO" system based on their unique identifiers, enabling features such as viewing message details or performing operations on specific messages.
        /// </summary>
        /// <param name="id">The unique identifier of the message to retrieve.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the MessageResponseDto object if found; otherwise, null.</returns>
        Task<MessageResponseDto?> GetByIdAsync(int id);

        /// <summary>
        /// Asynchronously deletes a message by its unique identifier. The method takes an integer id as a parameter and removes the corresponding message from the "Talk to CEO" system. This allows for the removal of messages from the system, enabling features such as deleting messages that are no longer needed or removing inappropriate content.
        /// </summary>
        /// <param name="id">The unique identifier of the message to delete.</param>
        /// <returns>A task that represents the asynchronous operation.</returns>
        Task DeleteAsync(int id);

        /// <summary>
        /// Asynchronously updates a message by its unique identifier. The method takes an integer id and a CreateMessageRequestDto as parameters, and updates the corresponding message in the "Talk to CEO" system with the new information provided in the DTO. This allows for the modification of existing messages in the system, enabling features such as editing message details or updating message status.
        /// </summary>
        /// <param name="id">The unique identifier of the message to update.</param>
        /// <param name="dto">The DTO containing the updated information for the message.</param>
        /// <param name="user">The user performing the update.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the updated MessageResponseDto object.</returns>
        Task<MessageResponseDto> UpdateAsync(int id, CreateMessageRequestDto dto, UserDto user);

        /// <summary>
        /// Asynchronously replies to a message by its unique identifier. The method takes an integer id and a ReplyMessageRequestDto as parameters, and creates a reply to the corresponding message in the "Talk to CEO" system with the information provided in the DTO. This allows for users to respond to messages in the system, enabling features such as engaging in conversations or providing feedback on messages.
        /// </summary>
        /// <param name="id">The unique identifier of the message to reply to.</param>
        /// <param name="dto">The DTO containing the reply information for the message.</param>
        /// <returns>A task that represents the asynchronous operation.</returns>
        Task ReplyAsync(int id, ReplyMessageRequestDto dto);

        /// <summary>
        /// Asynchronously updates the read status of a message by its unique identifier. The method takes an integer id as a parameter and updates the read status of the corresponding message in the "Talk to CEO" system. This allows for tracking whether a message has been read or not, enabling features such as marking messages as read or unread.
        /// </summary>
        /// <param name="id">The unique identifier of the message to update the read status for.</param>
        /// <param name="userName">The name of the user updating the read status.</param>
        /// <returns>A task that represents the asynchronous operation.</returns>
        Task UpdateReadStatusAsync(int id, string userName);

        /// <summary>
        /// Asynchronously updates the sent status of a message by its unique identifier. The method takes an integer id as a parameter and updates the sent status of the corresponding message in the "Talk to CEO" system. This allows for tracking whether a message has been sent or not, enabling features such as marking messages as sent or unsent.
        /// </summary>
        /// <param name="id">The unique identifier of the message to update the sent status for.</param>
        /// <param name="userName">The name of the user updating the sent status.</param>
        /// <returns>A task that represents the asynchronous operation.</returns>
        Task UpdateSentStatusAsync(int id, string userName);

        /// <summary>
        /// Asynchronously retrieves a list of messages based on specified criteria. The method takes several parameters, including a keyword for searching messages, sorting options, pagination details, and optional date filters. It returns a MessageResponseListDto object that contains a list of MessageResponseDto objects matching the specified criteria, along with additional information such as total count and pagination details. This can be useful for features such as searching for messages, displaying sorted lists of messages, or implementing pagination for large sets of messages.
        /// </summary>
        /// <param name="keyword">The keyword to search for in messages.</param>
        /// <param name="sortField">The field to sort the messages by.</param>
        /// <param name="pageNumber">The page number for pagination.</param>
        /// <param name="pageSize">The number of messages per page.</param>
        /// <param name="ascending">Whether to sort in ascending order.</param>
        /// <param name="excludeDraft">Whether to exclude draft messages.</param>
        /// <param name="userIdFilter">The user ID to filter messages by.</param>
        /// <param name="isCeo">Whether the user is a CEO, which may affect the visibility of certain messages.</param>
        /// <param name="searchStartDate">The start date for filtering messages.</param>
        /// <param name="searchEndDate">The end date for filtering messages.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a MessageResponseListDto object.</returns>
        Task<MessageResponseListDto> GetMessagesCriteriaAsync(
            string keyword,
            string sortField,
            int pageNumber,
            int pageSize,
            bool ascending,
            bool excludeDraft,
            string userIdFilter,
            bool isCeo,
            DateTimeOffset? searchStartDate,
            DateTimeOffset? searchEndDate);
    }
}
