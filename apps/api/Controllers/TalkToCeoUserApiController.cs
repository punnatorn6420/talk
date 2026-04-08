using System;
using Microsoft.AspNetCore.Mvc;
using NokAir.Core.Exceptions;
using NokAir.Shared.Api.Responses.Factories;
using NokAir.TalkToCeo.Shared.Dtos;
using NokAir.TalkToCeo.Shared.Dtos.Common;
using NokAir.TalkToCeo.Shared.Entities.Common;
using NokAir.TalkToCeo.Shared.Services;
using TalkToCeoUserApi.Controllers;

namespace NokAir.TalkToCeo.Api.Controllers
{
    /// <summary>
    /// Controller for handling user-related operations in the "Talk to CEO" system. This controller provides endpoints for managing user profiles, roles, and authentication tokens. It interacts with the underlying services to perform the necessary business logic and returns appropriate responses based on the outcome of each operation.
    /// </summary>
    public class TalkToCeoUserApiController : TalkToCeoUserApiControllerBase
    {
        private readonly IUsersService<UserDto> usersService;
        private readonly IRoleService roleService;
        private readonly IJwtTalkToCeo jwtTalkToCeoService;

        /// <summary>
        /// Initializes a new instance of the <see cref="TalkToCeoUserApiController"/> class with the specified dependencies. This constructor is used to inject the necessary services for user management, role management, and JWT token handling into the controller, allowing it to perform its operations effectively.
        /// </summary>
        /// <param name="apiResponseFactory">The factory for creating API responses.</param>
        /// <param name="usersService">The service for managing user information.</param>
        /// <param name="roleService">The service for managing roles.</param>
        /// <param name="jwtTalkToCeo">The service for handling JWT tokens.</param>
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

        /// <inheritdoc/>
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

        /// <inheritdoc/>
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

        /// <inheritdoc/>
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

        /// <inheritdoc/>
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

        /// <inheritdoc/>
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
