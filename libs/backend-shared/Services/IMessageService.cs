using System;
using NokAir.TalkToCeo.Shared.Dtos;

namespace NokAir.TalkToCeo.Shared.Services
{
    public interface IMessageService
    {
        Task<MessageResponseDto> CreateAsync(CreateMessageRequestDto dto);

        Task<List<MessageResponseDto>> GetAllAsync();

        Task<MessageResponseDto?> GetByIdAsync(int id);

        Task DeleteAsync(int id);

        Task<MessageResponseDto> UpdateAsync(int id, CreateMessageRequestDto dto);

        Task ReplyAsync(int id, ReplyMessageRequestDto dto);

        Task UpdateReadStatusAsync(int id);

        Task<MessageResponseListDto> GetMessagesCriteriaAsync(
            string keyword,
            string sortField,
            int pageNumber,
            int pageSize,
            bool ascending,
            DateTimeOffset? searchStartDate,
            DateTimeOffset? searchEndDate);
    }
}
