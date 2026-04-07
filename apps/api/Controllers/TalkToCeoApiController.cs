using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NokAir.Core.Exceptions;
using NokAir.Shared.Api.Responses.Factories;
using NokAir.TalkToCeo.Shared.Dtos;
using NokAir.TalkToCeo.Shared.Services;
using TalkToCeoApi.Controllers;
using NokAir.TalkToCeo.Shared.Entities.Common;
using NokAir.TalkToCeo.Shared.Enums;

namespace NokAir.TalkToCeo.api.Controllers
{
    public class TalkToCeoApiController : TalkToCeoApiControllerControllerBase
    {
        private readonly IMessageService messageService;
        private readonly IUsersService<UserDto> usersService;

        public TalkToCeoApiController(
              IResponseFactory apiResponseFactory,
              IMessageService messageService,
              IUsersService<UserDto> usersService)
              : base(apiResponseFactory)
        {
            this.messageService = messageService;
            this.usersService = usersService;
        }

        // [Authorize(Policy = "AllRole")]
        public override async Task<ActionResult> CreateMessage([FromBody] CreateMessageRequestDto body)
        {
            try
            {
                // var token = this.HttpContext.Request.Headers.Authorization.ToString().Replace("Bearer ", string.Empty);
                // var user = await this.usersService.GetUserFromTokenAsync(token);

                // var userNameAcc = (user?.FirstName ?? string.Empty) + " " + (user?.LastName ?? string.Empty);

                // if (user == null)
                // {
                //     throw new DataValidationException("User information in token is invalid.");
                // }

                // body.UserId = 999999;
                // body.UserName = userNameAcc;

                var result = await messageService.CreateAsync(body);

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

        // [Authorize(Policy = "AllRole")]
        public override async Task<ActionResult> DeleteMessage(int id)
        {
            try
            {
                var result = await messageService.GetByIdAsync(id);

                if (result == null)
                {
                    throw new DataValidationException("Message not found.");
                }

                if (result.Status == ActionStatus.Draft)
                {
                    await messageService.DeleteAsync(id);
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

        // [Authorize(Policy = "AllRole")]
        public override async Task<ActionResult> GetAllMessages(
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
                var result =
               await messageService.GetMessagesCriteriaAsync(
                   keyword,
                   sortField,
                   pageNumber ?? 1,
                   pageSize ?? 25,
                   ascending ?? true,
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

        // [Authorize(Policy = "AllRole")]
        public override async Task<ActionResult> GetMessageDetail(int id)
        {
            try
            {
                var result = await messageService.GetByIdAsync(id);

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

        // [Authorize(Policy = "AllRole")]
        public override async Task<ActionResult> ReplyMessage(int id, [FromBody] ReplyMessageRequestDto body)
        {
            try
            {
                var result = await messageService.GetByIdAsync(id);

                if (result == null)
                {
                    throw new DataValidationException("Message not found.");
                }

                if (result.Reply != null)
                {
                    throw new DataValidationException("Only messages without reply can be replied.");
                }

                await messageService.ReplyAsync(id, body);

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

        // [Authorize(Policy = "AllRole")]
        public override async Task<ActionResult> UpdateMessage(int id, [FromBody] CreateMessageRequestDto body)
        {
            try
            {
                var result = await messageService.GetByIdAsync(id);

                if (result == null)
                {
                    throw new DataValidationException("Message not found.");
                }

                if (result.Status == ActionStatus.Sent || result.Status == ActionStatus.Read || result.Status == ActionStatus.Replied)
                {
                    throw new DataValidationException("Only messages with Draft status can be updated.");
                }

                await messageService.UpdateAsync(id, body);

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

        // [Authorize(Policy = "AllRole")]
        public override async Task<ActionResult> UpdateReadStatus(int id)
        {
            try
            {
                var result = await messageService.GetByIdAsync(id);

                if (result == null)
                {
                    throw new DataValidationException("Message not found.");
                }

                if (result.Status == ActionStatus.Replied)
                {
                    throw new DataValidationException("Messages with Replied status cannot be marked as Read.");
                }

                await messageService.UpdateReadStatusAsync(id);

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
