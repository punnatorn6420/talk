using System.Globalization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NokAir.Core.Constants;
using NokAir.Core.Exceptions;
using NokAir.Shared.Api.Responses.Factories;
using NokAir.Shared.Security.HttpHeaderFilters;
using NokAir.TalkToCeo.Shared.Dtos;
using NokAir.TalkToCeo.Shared.Entities.Common;
using NokAir.TalkToCeo.Shared.Enums;
using NokAir.TalkToCeo.Shared.Services;
using TalkToCeoApi.Controllers;

namespace NokAir.TalkToCeo.Api.Controllers
{
    /// <summary>
    /// Controller for handling API requests related to the "Talk to CEO" feature. This controller provides endpoints for creating, retrieving, updating, and deleting messages, as well as replying to messages and updating their read status. The controller uses dependency injection to access the message service and user service, allowing it to perform necessary operations while adhering to the principles of separation of concerns and maintainability. Each endpoint is secured with appropriate authorization policies to ensure that only users with the correct roles can access specific functionalities.
    /// </summary>
    public class TalkToCeoApiController : TalkToCeoApiControllerBase
    {
        private readonly IMessageService messageService;
        private readonly IMessageAttachmentService messageAttachmentService;
        private readonly IUsersService<UserDto> usersService;

        /// <summary>
        /// Initializes a new instance of the <see cref="TalkToCeoApiController"/> class with the specified dependencies. The constructor takes in an IResponseFactory for creating API responses, an IMessageService for handling message-related operations, and an IUsersService for managing user information. These dependencies are injected into the controller to allow it to perform its functions effectively while maintaining a clean separation of concerns. The constructor also calls the base class constructor to ensure that any necessary initialization in the base class is performed correctly.
        /// </summary>
        /// <param name="apiResponseFactory">The factory for creating API responses.</param>
        /// <param name="messageService">The service for handling message-related operations.</param>
        /// <param name="messageAttachmentService">The service for handling message attachment-related operations.</param>
        /// <param name="usersService">The service for managing user information.</param>
        public TalkToCeoApiController(
              IResponseFactory apiResponseFactory,
              IMessageService messageService,
              IMessageAttachmentService messageAttachmentService,
              IUsersService<UserDto> usersService)
              : base(apiResponseFactory)
        {
            this.messageService = messageService;
            this.messageAttachmentService = messageAttachmentService;
            this.usersService = usersService;
        }

        /// <inheritdoc/>
        [Authorize(Policy = "UserRole")]
        [ClientApplicationValidationWithIDAndSecretAttribute]
        public override async Task<ActionResult> CreateMessageAsync([FromBody] CreateMessageRequestDto body)
        {
            try
            {
                var token = this.HttpContext.Request.Headers.Authorization.ToString().Replace("Bearer ", string.Empty);

                var user = await this.usersService.GetUserFromTokenAsync(token);

                var userNameAcc = (user?.FirstName ?? string.Empty) + " " + (user?.LastName ?? string.Empty);

                if (user == null)
                {
                    throw new DataValidationException("User information in token is invalid.");
                }

                body.UserId = user.Id;
                body.UserName = userNameAcc;
                await this.messageService.CreateAsync(body);

                return this.OkSuccessResponse();
            }
            catch (DataValidationException ex)
            {
                return this.BadRequestResponseFromMessage(ex.Message);
            }
            catch (Exception ex)
            {
                return this.InternalServerErrorResponseFromException(ex);
            }
        }

        /// <inheritdoc/>
        [Authorize(Policy = "UserRole")]
        [ClientApplicationValidationWithIDAndSecretAttribute]
        public override async Task<ActionResult> DeleteMessageAsync(int id)
        {
            try
            {
                var result = await this.messageService.GetByIdAsync(id);

                if (result == null)
                {
                    throw new DataValidationException("Message not found.");
                }

                if (result.Status == ActionStatus.Draft)
                {
                    await this.messageService.DeleteAsync(id);
                }
                else
                {
                    throw new DataValidationException("Only messages with Draft status can be deleted.");
                }

                return this.OkSuccessResponse();
            }
            catch (DataValidationException ex)
            {
                return this.BadRequestResponseFromMessage(ex.Message);
            }
            catch (Exception ex)
            {
                return this.InternalServerErrorResponseFromException(ex);
            }
        }

        /// <inheritdoc/>
        [Authorize(Policy = "AllRole")]
        [ClientApplicationValidationWithIDAndSecretAttribute]
        public override async Task<ActionResult> GetAttachmentAsync(int id)
        {
            try
            {
                var file = await this.messageAttachmentService.GetDownloadFileAsync(id);

                if (file == null)
                {
                    throw new DataValidationException("Attachment not found.");
                }

                return this.PhysicalFile(file.Value.FullPath, "application/octet-stream", file.Value.FileName);
            }
            catch (DataValidationException ex)
            {
                return this.BadRequestResponseFromMessage(ex.Message);
            }
            catch (Exception ex)
            {
                return this.InternalServerErrorResponseFromException(ex);
            }
        }

        /// <inheritdoc/>
        [Authorize(Policy = "AllRole")]
        [ClientApplicationValidationWithIDAndSecretAttribute]
        public override async Task<ActionResult> SubmitAttachmentAsync(int id)
        {
            try
            {
                var token = this.HttpContext.Request.Headers.Authorization.ToString().Replace("Bearer ", string.Empty);

                var user = await this.usersService.GetUserFromTokenAsync(token);

                if (user == null)
                {
                    throw new DataValidationException("User information in token is invalid.");
                }

                var result = await this.messageAttachmentService.StoreFilesForMessageAsync(id, this.Request.Form.Files, user);

                return this.OkSuccessResponse();
            }
            catch (DataValidationException ex)
            {
                return this.BadRequestResponseFromMessage(ex.Message);
            }
            catch (Exception ex)
            {
                return this.InternalServerErrorResponseFromException(ex);
            }
        }

        /// <inheritdoc/>
        [Authorize(Policy = "AllRole")]
        [ClientApplicationValidationWithIDAndSecretAttribute]
        public override async Task<ActionResult> GetAllMessagesAsync(
            [FromQuery] string keyword,
            [FromQuery] string sortField,
            [FromQuery] int? pageNumber = 1,
            [FromQuery] int? pageSize = 25,
            [FromQuery] bool? ascending = true,
            [FromQuery] DateTimeOffset? searchStartDate = null,
            [FromQuery] DateTimeOffset? searchEndDate = null)
        {
            try
            {
                var token = this.HttpContext.Request.Headers.Authorization.ToString().Replace("Bearer ", string.Empty);

                var user = await this.usersService.GetUserFromTokenAsync(token);

                if (user == null)
                {
                    throw new DataValidationException("User information in token is invalid.");
                }

                var role = user.Roles.FirstOrDefault();

                var isCeo = role?.Equals("Ceo", StringComparison.OrdinalIgnoreCase) == true;

                var excludeDraft = isCeo;

                var result =
                    await this.messageService.GetMessagesCriteriaAsync(
                        keyword,
                        sortField,
                        pageNumber ?? 1,
                        pageSize ?? 25,
                        ascending ?? true,
                        excludeDraft,
                        user.Id.ToString(CultureInfo.CurrentCulture) ?? string.Empty,
                        isCeo,
                        searchStartDate,
                        searchEndDate);

                return this.OkResponseWithResult(result);
            }
            catch (DataValidationException ex)
            {
                return this.BadRequestResponseFromMessage(ex.Message);
            }
            catch (Exception ex)
            {
                return this.InternalServerErrorResponseFromException(ex);
            }
        }

        /// <inheritdoc/>
        [Authorize(Policy = "AllRole")]
        [ClientApplicationValidationWithIDAndSecretAttribute]
        public override async Task<ActionResult> GetMessageDetailAsync(int id)
        {
            try
            {
                var result = await this.messageService.GetByIdAsync(id);

                return this.OkResponseWithResult(result);
            }
            catch (DataValidationException ex)
            {
                return this.BadRequestResponseFromMessage(ex.Message);
            }
            catch (Exception ex)
            {
                return this.InternalServerErrorResponseFromException(ex);
            }
        }

        /// <inheritdoc/>
        [Authorize(Policy = "CeoRole")]
        [ClientApplicationValidationWithIDAndSecretAttribute]
        public override async Task<ActionResult> ReplyMessageAsync(int id, [FromBody] ReplyMessageRequestDto body)
        {
            try
            {
                var token = this.HttpContext.Request.Headers.Authorization.ToString().Replace("Bearer ", string.Empty);

                var user = await this.usersService.GetUserFromTokenAsync(token);

                if (user == null)
                {
                    throw new DataValidationException("User information in token is invalid.");
                }

                var result = await this.messageService.GetByIdAsync(id);

                if (result == null)
                {
                    throw new DataValidationException("Message not found.");
                }

                if (result.Reply != null)
                {
                    throw new DataValidationException("Only messages without reply can be replied.");
                }

                body.UserName = user.FirstName + " " + user.LastName;
                body.CeoId = user.Id;

                await this.messageService.ReplyAsync(id, body);

                return this.OkSuccessResponse();
            }
            catch (DataValidationException ex)
            {
                return this.BadRequestResponseFromMessage(ex.Message);
            }
            catch (Exception ex)
            {
                return this.InternalServerErrorResponseFromException(ex);
            }
        }

        /// <inheritdoc/>
        [Authorize(Policy = "UserRole")]
        [ClientApplicationValidationWithIDAndSecretAttribute]
        public override async Task<ActionResult> UpdateMessageAsync(int id, [FromBody] CreateMessageRequestDto body)
        {
            try
            {
                var result = await this.messageService.GetByIdAsync(id);

                if (result == null)
                {
                    throw new DataValidationException("Message not found.");
                }

                if (result.Status == ActionStatus.Sent || result.Status == ActionStatus.Read || result.Status == ActionStatus.Replied)
                {
                    throw new DataValidationException("Only messages with Draft status can be updated.");
                }

                await this.messageService.UpdateAsync(id, body);

                return this.OkSuccessResponse();
            }
            catch (DataValidationException ex)
            {
                return this.BadRequestResponseFromMessage(ex.Message);
            }
            catch (Exception ex)
            {
                return this.InternalServerErrorResponseFromException(ex);
            }
        }

        /// <inheritdoc/>
        [Authorize(Policy = "CeoRole")]
        [ClientApplicationValidationWithIDAndSecretAttribute]
        public override async Task<ActionResult> UpdateReadStatusAsync(int id)
        {
            try
            {
                var token = this.HttpContext.Request.Headers.Authorization.ToString().Replace("Bearer ", string.Empty);

                var user = await this.usersService.GetUserFromTokenAsync(token);

                if (user == null)
                {
                    throw new DataValidationException("User information in token is invalid.");
                }

                var result = await this.messageService.GetByIdAsync(id);

                if (result == null)
                {
                    throw new DataValidationException("Message not found.");
                }

                if (result.Status == ActionStatus.Replied)
                {
                    throw new DataValidationException("Messages with Replied status cannot be marked as Read.");
                }

                string userName = user.FirstName + " " + user.LastName;

                await this.messageService.UpdateReadStatusAsync(id, userName);

                return this.OkSuccessResponse();
            }
            catch (DataValidationException ex)
            {
                return this.BadRequestResponseFromMessage(ex.Message);
            }
            catch (Exception ex)
            {
                return this.InternalServerErrorResponseFromException(ex);
            }
        }
    }
}
