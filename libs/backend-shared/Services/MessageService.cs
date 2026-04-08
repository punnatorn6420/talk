using System;
using System.ComponentModel.DataAnnotations;
using NokAir.Core.Exceptions;
using NokAir.TalkToCeo.Shared.Dtos;
using NokAir.TalkToCeo.Shared.Entities.TalkToCeo;
using NokAir.TalkToCeo.Shared.Enums;
using NokAir.TalkToCeo.Shared.Repositories;

namespace NokAir.TalkToCeo.Shared.Services
{
    /// <summary>
    /// Implements the IMessageService interface to provide functionality for managing messages in the "Talk to CEO" application. The MessageService class is responsible for handling operations related to messages, such as creating, retrieving, updating, deleting, and replying to messages. It interacts with the IMessageRepository to perform data access operations and ensures that the business logic for message management is properly implemented. This service allows users to communicate effectively with the CEO by managing their messages and providing necessary functionalities to handle various message-related actions within the application.
    /// </summary>
    public class MessageService : IMessageService
    {
        private readonly IMessageRepository repository;

        /// <summary>
        /// Initializes a new instance of the <see cref="MessageService"/> class with the specified IMessageRepository. The constructor takes an IMessageRepository as a parameter and assigns it to a private readonly field, allowing the service to interact with the repository for performing data access operations related to messages. This setup enables the MessageService to manage message data effectively while maintaining a clear separation of concerns between the service layer and the data access layer of the application.
        /// </summary>
        /// <param name="repository">The message repository.</param>
        public MessageService(IMessageRepository repository)
        {
            this.repository = repository;
        }

        /// <inheritdoc/>
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
                ModifiedBy = dto.UserName,
            };
            await this.repository.AddMessageAsync(entity);
        }

        /// <inheritdoc/>
        public async Task<List<MessageResponseDto>> GetAllAsync()
        {
            var messages = await this.repository.FindMessagesListAsync();

            return messages.Select(x => new MessageResponseDto
            {
                Id = x.Id,
                Subject = x.Subject,
                Message = x.Detail,
            }).ToList();
        }

        /// <inheritdoc/>
        public async Task<MessageResponseDto?> GetByIdAsync(int id)
        {
            var message = await this.repository.FindMessageByIdAsync(id);

            if (message == null)
            {
                return null;
            }

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
                FullName = $"{message.User.FirstName} {message.User.LastName}",
            };
        }

        /// <inheritdoc/>
        public async Task DeleteAsync(int id)
        {
            var message = await this.repository.FindMessageByIdAsync(id);

            if (message == null)
            {
                throw new DataValidationException("Message not found");
            }

            await this.repository.RemoveMessageAsync(message);
        }

        /// <inheritdoc/>
        public async Task<MessageResponseDto> UpdateAsync(int id, CreateMessageRequestDto dto)
        {
            var entity = await this.repository.FindMessageByIdAsync(id);

            if (entity == null)
            {
                throw new DataValidationException("Message not found");
            }

            entity.Subject = dto.Subject;
            entity.Detail = dto.Detail;
            entity.Status = dto.Status;
            entity.ModifiedAt = DateTime.Now;
            entity.ModifiedBy = dto.UserName;

            await this.repository.UpdateAsync(entity);

            return new MessageResponseDto
            {
                Id = entity.Id,
                Subject = entity.Subject,
                Message = entity.Detail,
            };
        }

        /// <inheritdoc/>
        public async Task ReplyAsync(int id, ReplyMessageRequestDto dto)
        {
            var entity = await this.repository.FindMessageByIdAsync(id);

            if (entity == null)
            {
                throw new DataValidationException("Message not found");
            }

            entity.CeoReply = dto.Reply;
            entity.Status = ActionStatus.Replied;
            entity.ModifiedAt = DateTime.Now;
            entity.ModifiedBy = dto.UserName;

            entity.RepliedAt = DateTime.Now;

            await this.repository.UpdateAsync(entity);
        }

        /// <inheritdoc/>
        public async Task UpdateReadStatusAsync(int id, string userName)
        {
            var entity = await this.repository.FindMessageByIdAsync(id);

            if (entity == null)
            {
                throw new DataValidationException("Message not found");
            }

            entity.Status = ActionStatus.Read;
            entity.ReadAt = DateTime.Now;
            entity.ModifiedAt = DateTime.Now;
            entity.ModifiedBy = userName;

            await this.repository.UpdateAsync(entity);
        }

        /// <inheritdoc/>
        public async Task<MessageResponseListDto> GetMessagesCriteriaAsync(
            string keyword,
            string sortField,
            int pageNumber,
            int pageSize,
            bool ascending,
            bool excludeDraft,
            string userIdFilter,
            DateTimeOffset? searchStartDate,
            DateTimeOffset? searchEndDate)
        {
            var messages =
                await this.repository.FindMessagesCriteriaAsync(
                    keyword,
                    sortField,
                    pageNumber,
                    pageSize,
                    ascending,
                    excludeDraft,
                    userIdFilter,
                    searchStartDate,
                    searchEndDate);

            var result = new MessageResponseListDto
            {
                TotalCount = messages.TotalCount,
                Items = messages.Items.Select(x =>
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
                        FullName = $"{x.User.FirstName} {x.User.LastName}",
                    })
                    .ToList(),
            };

            return result;
        }
    }
}
