using System;
using NokAir.Core.Domain.Entities.InHouse;
using NokAir.TalkToCeo.Shared.Dtos;

namespace NokAir.TalkToCeo.Shared.Services
{
    /// <summary>
    /// Defines the contract for the broadcast service in the TalkToCeo application. This service is responsible for managing broadcast messages, including creating new broadcasts. The interface currently includes a method for creating a broadcast, which takes a CreateBroadcastRequestDto and the ID of the CEO as parameters. Implementations of this interface will provide the actual business logic for handling broadcast messages, allowing for separation of concerns and easier maintenance of the codebase.
    /// </summary>
    public interface IBroadcastService
    {
        /// <summary>
        /// Creates a new broadcast message.
        /// </summary>
        /// <param name="dto">The data transfer object containing the broadcast details.</param>
        /// <param name="ceoId">The ID of the CEO creating the broadcast.</param>
        /// <param name="user">The user creating the broadcast.</param>
        /// <returns>A task representing the asynchronous operation.</returns>
        Task<int> CreateBroadcastAsync(CreateBroadcastRequestDto dto, int ceoId, UserDto user);

        /// <summary>
        /// Deletes an existing broadcast message. This method takes the ID of the broadcast to be deleted and the ID of the CEO as parameters. Implementations of this method should ensure that the specified broadcast exists and that the CEO has the necessary permissions to delete it before performing the deletion operation. Proper error handling should be implemented to manage cases where the broadcast does not exist or the CEO does not have permission to delete it.
        /// </summary>
        /// <param name="broadcastId">The ID of the broadcast to be deleted.</param>
        /// <param name="ceoId">The ID of the CEO attempting to delete the broadcast.</param>
        /// <returns>A task representing the asynchronous operation.</returns>
        Task DeleteBroadcastAsync(int broadcastId, int ceoId);

        /// <summary>
        /// Retrieves the list of readers for a specific broadcast message. This method takes the ID of the broadcast and the ID of the CEO as parameters. Implementations of this method should ensure that the specified broadcast exists and that the CEO has the necessary permissions to view the readers before performing the retrieval operation. Proper error handling should be implemented to manage cases where the broadcast does not exist or the CEO does not have permission to view the readers.
        /// </summary>
        /// <param name="broadcastId">The ID of the broadcast message.</param>
        /// <param name="ceoId">The ID of the CEO attempting to view the readers.</param>
        /// <returns>A task representing the asynchronous operation, containing a list of broadcast reader response DTOs.</returns>
        Task<List<BroadcastReaderResponseDto>> GetBroadcastReadersAsync(int broadcastId, int ceoId);

        /// <summary>
        /// Retrieves the read summary for a specific broadcast message. This method takes the ID of the broadcast and the ID of the CEO as parameters. Implementations of this method should ensure that the specified broadcast exists and that the CEO has the necessary permissions to view the read summary before performing the retrieval operation. Proper error handling should be implemented to manage cases where the broadcast does not exist or the CEO does not have permission to view the read summary.
        /// </summary>
        /// <param name="broadcastId">The ID of the broadcast message.</param>
        /// <param name="ceoId">The ID of the CEO attempting to view the read summary.</param>
        /// <returns>A task representing the asynchronous operation, containing the broadcast read summary response DTO.</returns>
        Task<BroadcastReadSummaryResponseDto> GetBroadcastReadSummaryAsync(int broadcastId, int ceoId);

        /// <summary>
        /// Retrieves a paginated list of broadcast messages based on the specified search criteria. This method takes various parameters for filtering, sorting, and paginating the results, including a keyword for searching, the field to sort by, pagination details (page number and page size), sorting order (ascending or descending), optional date range for filtering broadcasts, and the ID of the CEO. Implementations of this method should ensure that the specified CEO has the necessary permissions to view the broadcasts before performing the retrieval operation. Proper error handling should be implemented to manage cases where the CEO does not have permission to view the broadcasts or when invalid search criteria are provided.
        /// </summary>
        /// <param name="keyword">The keyword to search for in broadcast messages.</param>
        /// <param name="sortField">The field by which to sort the results.</param>
        /// <param name="pageNumber">The page number for pagination.</param>
        /// <param name="pageSize">The number of items per page for pagination.</param>
        /// <param name="ascending">Indicates whether the sorting should be in ascending order.</param>
        /// <param name="searchStartDate">The start date for filtering broadcasts.</param>
        /// <param name="searchEndDate">The end date for filtering broadcasts.</param>
        /// <param name="ceoId">The ID of the CEO attempting to view the broadcasts.</param>
        /// <returns>A task representing the asynchronous operation, containing a paginated list of broadcast response DTOs.</returns>
        Task<BroadcastResponseListDto> GetBroadcastsAsync(
            string keyword,
            string sortField,
            int pageNumber,
            int pageSize,
            bool ascending,
            DateTimeOffset? searchStartDate,
            DateTimeOffset? searchEndDate,
            int ceoId);

        /// <summary>
        /// Retrieves the list of broadcast messages for a specific user. This method takes the ID of the user as a parameter and returns a list of broadcast response DTOs that are relevant to that user. Implementations of this method should ensure that the specified user exists and has the necessary permissions to view the broadcasts before performing the retrieval operation. Proper error handling should be implemented to manage cases where the user does not exist or does not have permission to view the broadcasts.
        /// </summary>
        /// <param name="userId">The ID of the user attempting to view the broadcasts.</param>
        /// <returns>A task representing the asynchronous operation, containing a list of broadcast response DTOs.</returns>
        Task<List<BroadcastResponseDto>> GetMyBroadcastsAsync(int userId);

        /// <summary>
        /// Updates the read status of a specific broadcast message for a given user. This method takes the ID of the broadcast message and the ID of the user as parameters. Implementations of this method should ensure that the specified broadcast message exists and that the user has the necessary permissions to update the read status before performing the update operation. Proper error handling should be implemented to manage cases where the broadcast message does not exist or the user does not have permission to update the read status.
        /// </summary>
        /// <param name="broadcastId">The ID of the broadcast message to update.</param>
        /// <param name="userId">The ID of the user attempting to update the read status.</param>
        /// <returns>A task representing the asynchronous operation.</returns>
        Task UpdateReadBroadcastAsync(int broadcastId, int userId);

        /// <summary>
        /// Updates an existing broadcast message with new details. This method takes the ID of the broadcast message to be updated, a DTO containing the updated broadcast details, and the ID of the CEO as parameters. Implementations of this method should ensure that the specified broadcast message exists and that the CEO has the necessary permissions to update it before performing the update operation. Proper error handling should be implemented to manage cases where the broadcast message does not exist or the CEO does not have permission to update it.
        /// </summary>
        /// <param name="broadcastId">The ID of the broadcast message to update.</param>
        /// <param name="dto">A DTO containing the updated broadcast details.</param>
        /// <param name="ceoId">The ID of the CEO attempting to update the broadcast.</param>
        /// <returns>A task representing the asynchronous operation.</returns>
        Task UpdateBroadcastAsync(int broadcastId, UpdateBroadcastRequestDto dto, int ceoId);

        /// <summary>
        /// Retrieves the details of a specific broadcast message by its ID. This method takes the ID of the broadcast message and the ID of the user as parameters. Implementations of this method should ensure that the specified broadcast message exists and that the user has the necessary permissions to view its details before performing the retrieval operation. Proper error handling should be implemented to manage cases where the broadcast message does not exist or the user does not have permission to view its details.
        /// </summary>
        /// <param name="id">The ID of the broadcast message to retrieve.</param>
        /// <param name="userId">The ID of the user attempting to view the broadcast.</param>
        /// <returns>A task representing the asynchronous operation, containing the broadcast details.</returns>
        Task<BroadcastResponseDto> GetBroadcastByIdAsync(int id, int userId);
    }
}
