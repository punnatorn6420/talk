using System;
using Microsoft.AspNetCore.Mvc;
using NokAir.Shared.Api.Responses.Factories;
using NokAir.TalkToCeo.Shared.Dtos.Common;
using TalkToCeoUserApi.Controllers;
using NokAir.TalkToCeo.Shared.Services;
using NokAir.TalkToCeo.Shared.Entities.Common;
using NokAir.TalkToCeo.Shared.Dtos;
using NokAir.Core.Exceptions;

namespace NokAir.TalkToCeo.api.Controllers
{
    public class TalkToCeoUserApiController : TalkToCeoUserApiControllerBase
    {

        public readonly IUsersService<UserDto> usersService;
        public readonly IRoleService roleService;
        public readonly IJwtTalkToCeo jwtTalkToCeoService;

        public TalkToCeoUserApiController(
            IResponseFactory apiResponseFactory,
            IUsersService<UserDto> usersService,
            IRoleService roleService,
            IJwtTalkToCeo jwtTalkToCeo)
        : base(apiResponseFactory)
        {
            this.usersService = usersService;
            this.roleService = roleService;
            this.jwtTalkToCeoService = jwtTalkToCeo;
        }

        public override async Task<ActionResult> AddPortalUser([FromBody] AddUserFromPotal body)
        {
            try
            {
                await this.usersService.AddUserAsync(body);
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

        public override async Task<ActionResult> GetProfileUser()
        {
            try
            {
                var token = this.HttpContext.Request.Headers.Authorization.ToString().Replace("Bearer ", string.Empty);

                var user = await this.usersService.GetUserFromTokenAsync(token);

                if (user == null)
                {
                    return this.BadRequestResponseFromMessage("User not found or invalid token.");
                }

                return this.OkResponseWithResult(user);
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

        public override async Task<ActionResult> GetRoles()
        {
            try
            {
                var res = await this.roleService.GetRolesAsync();
                return this.OkResponseWithResult(res);
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

        public override async Task<ActionResult> RefreshAccessToken()
        {
            try
            {
                var token = this.HttpContext.Request.Headers.Authorization.ToString().Replace("Bearer ", string.Empty);
                var res = await this.jwtTalkToCeoService.RefreshAccessTokenAsync(token);
                return this.OkResponseWithResult(res);
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

        public override async Task<ActionResult> AuthenticateJwtToken()
        {
            try
            {
                var token = this.HttpContext.Request.Headers.Authorization.ToString().Replace("Bearer ", string.Empty);

                if (this.jwtTalkToCeoService.TryValidateToken(token, out _, out var expiresAt))
                {
                    if (expiresAt.HasValue && expiresAt.Value < DateTime.UtcNow)
                    {
                        throw new DataValidationException("JWT token has expired.");
                    }

                    var res = await this.jwtTalkToCeoService.RefreshAccessTokenAsync(token);
                    return this.OkResponseWithResult(res);
                }

                return this.BadRequestResponseFromMessage("Cannot validate token.");
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
