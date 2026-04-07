using System;
using System.ComponentModel.DataAnnotations;
using NokAir.Core.Exceptions;
using NokAir.TalkToCeo.Shared.Dtos;
using NokAir.TalkToCeo.Shared.Entities.TalkToCeo;
using NokAir.TalkToCeo.Shared.Enums;
using NokAir.TalkToCeo.Shared.Repositories;

namespace NokAir.TalkToCeo.Shared.Services
{
    public class MessageService : IMessageService
    {
        private readonly IMessageRepository repository;

        public MessageService(IMessageRepository repository)
        {
            this.repository = repository;
        }

        public async Task CreateAsync(CreateMessageRequestDto dto)
        {
            var entity = new Messages
            {
                Subject = dto.Subject,
                Detail = dto.Detail,
                PostedAt = DateTime.Now,
                Status = dto.Status,
                UserId = dto.UserId,
                CreatedAt = DateTime.Now,
                ModifiedAt = DateTime.Now,
                CreatedBy = dto.UserName,
                ModifiedBy = dto.UserName
            };
            await repository.AddMessageAsync(entity);
        }

        public async Task<List<MessageResponseDto>> GetAllAsync()
        {
            var messages = await repository.FindMessagesListAsync();

            return messages.Select(x => new MessageResponseDto
            {
                Id = x.Id,
                Subject = x.Subject,
                Message = x.Detail
            }).ToList();
        }

        public async Task<MessageResponseDto?> GetByIdAsync(int id)
        {
            var message = await repository.FindMessageByIdAsync(id);

            if (message == null)
                return null;

            return new MessageResponseDto
            {
                Id = message.Id,
                Subject = message.Subject,
                Message = message.Detail,
                Status = message.Status,
                Reply = message.CeoReply,
                PostedAt = message.PostedAt,
                CreatedBy = message.CreatedBy,
                ModifiedBy = message.ModifiedBy,
                CreatedAt = message.CreatedAt,
                ModifiedAt = message.ModifiedAt,
                RepliedAt = message.RepliedAt ?? DateTime.MinValue,
                Email = message.User.Email,
                JobTitle = message.User.JobTitle,
                Department = message.User.Department,
                FullName = $"{message.User.FirstName} {message.User.LastName}"
            };
        }

        public async Task DeleteAsync(int id)
        {
            var message = await repository.FindMessageByIdAsync(id);

            if (message == null)
                throw new Exception("Message not found");

            await repository.RemoveMessageAsync(message);
        }

        public async Task<MessageResponseDto> UpdateAsync(int id, CreateMessageRequestDto dto)
        {
            var entity =
             await repository.FindMessageByIdAsync(id);

            if (entity == null)
                throw new DataValidationException("Message not found");

            entity.Subject = dto.Subject;
            entity.Detail = dto.Detail;
            entity.Status = dto.Status;
            entity.ModifiedAt = DateTime.Now;
            entity.ModifiedBy = dto.UserName;

            await repository.UpdateAsync(entity);

            return new MessageResponseDto
            {
                Id = entity.Id,
                Subject = entity.Subject,
                Message = entity.Detail
            };
        }

        public async Task ReplyAsync(int id, ReplyMessageRequestDto dto)
        {
            var entity = await repository.FindMessageByIdAsync(id);

            if (entity == null)
                throw new KeyNotFoundException("Message not found");

            entity.CeoReply = dto.Reply;
            entity.Status = ActionStatus.Replied;

            entity.RepliedAt = DateTime.Now;

            await repository.UpdateAsync(entity);
        }

        public async Task UpdateReadStatusAsync(int id)
        {
            var entity = await repository.FindMessageByIdAsync(id);

            if (entity == null)
                throw new KeyNotFoundException("Message not found");

            entity.Status = ActionStatus.Read;

            await repository.UpdateAsync(entity);
        }

        public async Task<MessageResponseListDto> GetMessagesCriteriaAsync(
            string keyword,
            string sortField,
            int pageNumber,
            int pageSize,
            bool ascending,
            DateTimeOffset? searchStartDate,
            DateTimeOffset? searchEndDate,
            string? userIdFilter)
        {
            var messages =
                await repository.FindMessagesCriteriaAsync(
                    keyword,
                    sortField,
                    pageNumber,
                    pageSize,
                    ascending,
                    searchStartDate,
                    searchEndDate,
                    userIdFilter);

            var result = new MessageResponseListDto
            {
                TotalCount = messages.Count,
                Items = messages.Select(x =>
                    new MessageResponseDto
                    {
                        Id = x.Id,
                        Subject = x.Subject,
                        Message = x.Detail,
                        Reply = x.CeoReply,
                        Status = x.Status,
                        PostedAt = x.PostedAt,
                        CreatedBy = x.CreatedBy,
                        ModifiedBy = x.ModifiedBy,
                        CreatedAt = x.CreatedAt,
                        ModifiedAt = x.ModifiedAt,
                        RepliedAt = x.RepliedAt ?? DateTime.MinValue,
                        Email = x.User.Email,
                        JobTitle = x.User.JobTitle,
                        Department = x.User.Department,
                        FullName = $"{x.User.FirstName} {x.User.LastName}"
                    })
                    .ToList()
            };

            return result;
        }
    }
}
