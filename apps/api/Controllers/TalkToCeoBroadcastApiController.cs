using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NokAir.Core.Exceptions;
using NokAir.Shared.Api.Responses.Factories;
using NokAir.Shared.Security.HttpHeaderFilters;
using NokAir.TalkToCeo.Shared.Dtos;
using NokAir.TalkToCeo.Shared.Services;
using TalkToCeoApi.Controllers;

namespace NokAir.TalkToCeo.Api.Controllers
{
    /// <summary>
    /// Controller for managing broadcast messages in the TalkToCeo application. This controller provides endpoints for creating, updating, deleting, and retrieving broadcast messages, as well as tracking readers and read summaries. The controller inherits from TalkToCeoBroadcastApiControllerBase, which defines the contract for the API endpoints. Each method in this controller is currently not implemented and will throw a NotImplementedException when called. This structure allows for future implementation of the business logic while maintaining a clear separation of concerns and adhering to the defined API contract.
    /// </summary>
    public class TalkToCeoBroadcastApiController : TalkToCeoBroadcastApiControllerBase
    {
        private readonly IUsersService<UserDto> usersService;

        private readonly IBroadcastService broadcastService;

        private readonly IMessageAttachmentService messageAttachmentService;

        /// <summary>
        /// Initializes a new instance of the <see cref="TalkToCeoBroadcastApiController"/> class with the specified response factory. The response factory is used to create standardized API responses for the endpoints defined in this controller. This constructor allows for dependency injection of the response factory, enabling better testability and separation of concerns in the application architecture.
        /// </summary>
        /// <param name="apiResponseFactory">The response factory used to create standardized API responses.</param>
        /// <param name="usersService">The service used to manage user-related operations.</param>
        /// <param name="broadcastService">The service used to manage broadcast-related operations.</param>
        /// <param name="messageAttachmentService">The service used to manage message attachments.</param>
        public TalkToCeoBroadcastApiController(
            IResponseFactory apiResponseFactory,
            IUsersService<UserDto> usersService,
            IBroadcastService broadcastService,
            IMessageAttachmentService messageAttachmentService)
        : base(apiResponseFactory)
        {
            this.usersService = usersService;
            this.broadcastService = broadcastService;
            this.messageAttachmentService = messageAttachmentService;
        }

        /// <inheritdoc/>
        [Authorize(Policy = "CeoRole")]
        [ClientApplicationValidationWithIDAndSecretAttribute]

        public override async Task<ActionResult> CreateBroadcast([FromForm] CreateBroadcastRequestDto body)
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

                var broadcastId = await this.broadcastService.CreateBroadcastAsync(body, user.Id, user);

                if (body.Attachments != null &&
              body.Attachments.Count > 0)
                {
                    await this.messageAttachmentService
                        .StoreFilesForMessageAsync(
                            broadcastId,
                            body.Attachments,
                            user);
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
        [Authorize(Policy = "CeoRole")]
        [ClientApplicationValidationWithIDAndSecretAttribute]

        public override async Task<ActionResult> DeleteBroadcast(int id)
        {
            try
            {
                var token = this.HttpContext.Request.Headers.Authorization.ToString().Replace("Bearer ", string.Empty);

                var user = await this.usersService.GetUserFromTokenAsync(token);

                if (user == null)
                {
                    throw new DataValidationException("User information in token is invalid.");
                }

                await this.broadcastService.DeleteBroadcastAsync(id, user.Id);

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

        public override async Task<ActionResult> GetBroadcastReaders(int id)
        {
            try
            {
                var token = this.HttpContext.Request.Headers.Authorization
                    .ToString()
                    .Replace("Bearer ", string.Empty);

                var user = await this.usersService.GetUserFromTokenAsync(token);

                if (user == null)
                {
                    throw new DataValidationException("User information in token is invalid.");
                }

                var result = await this.broadcastService.GetBroadcastReadersAsync(id, user.Id);

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

        public override async Task<ActionResult> GetBroadcastReadSummary(int id)
        {
            try
            {
                var token = this.HttpContext.Request.Headers.Authorization
                    .ToString()
                    .Replace("Bearer ", string.Empty);

                var user = await this.usersService.GetUserFromTokenAsync(token);

                if (user == null)
                {
                    throw new DataValidationException("User information in token is invalid.");
                }

                var result = await this.broadcastService.GetBroadcastReadSummaryAsync(id, user.Id);

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
        public override async Task<ActionResult> GetBroadcasts(
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
                var token = this.HttpContext.Request.Headers.Authorization
                    .ToString()
                    .Replace("Bearer ", string.Empty);

                var user = await this.usersService.GetUserFromTokenAsync(token);

                if (user == null)
                {
                    throw new DataValidationException("User information in token is invalid.");
                }

                var result = await this.broadcastService.GetBroadcastsAsync(
                    keyword,
                    sortField,
                    pageNumber ?? 1,
                    pageSize ?? 25,
                    ascending ?? true,
                    searchStartDate,
                    searchEndDate,
                    user.Id);

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

        public override async Task<ActionResult> GetMyBroadcasts()
        {
            try
            {
                var token = this.HttpContext.Request.Headers.Authorization
                    .ToString()
                    .Replace("Bearer ", string.Empty);

                var user = await this.usersService.GetUserFromTokenAsync(token);

                if (user == null)
                {
                    throw new DataValidationException("User information in token is invalid.");
                }

                var result = await this.broadcastService
                    .GetMyBroadcastsAsync(user.Id);

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

        public override async Task<ActionResult> UpdateReadBroadcast(int id)
        {
            try
            {
                var token = this.HttpContext.Request.Headers.Authorization
                    .ToString()
                    .Replace("Bearer ", string.Empty);

                var user = await this.usersService.GetUserFromTokenAsync(token);

                if (user == null)
                {
                    throw new DataValidationException("User information in token is invalid.");
                }

                await this.broadcastService.UpdateReadBroadcastAsync(id, user.Id);

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

        public override async Task<ActionResult> UpdateBroadcast(int id, [FromBody] UpdateBroadcastRequestDto body)
        {
            try
            {
                var token = this.HttpContext.Request.Headers.Authorization
                    .ToString()
                    .Replace("Bearer ", string.Empty);

                var user = await this.usersService.GetUserFromTokenAsync(token);

                if (user == null)
                {
                    throw new DataValidationException("User information in token is invalid.");
                }

                await this.broadcastService.UpdateBroadcastAsync(
                    id,
                    body,
                    user.Id);

                if (body.Attachments != null &&
                    body.Attachments.Count > 0)
                {
                    await this.messageAttachmentService
                        .StoreFilesForMessageAsync(
                            id,
                            body.Attachments,
                            user);
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
    }
}
