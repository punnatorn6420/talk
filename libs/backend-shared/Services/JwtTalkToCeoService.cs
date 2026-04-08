using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using NokAir.Core.Exceptions;
using NokAir.Shared.Security.Models.Common;
using NokAir.Shared.Security.Services.InHouse;
using NokAir.TalkToCeo.Shared.Dtos;

namespace NokAir.TalkToCeo.Shared.Services
{
    /// <summary>
    /// Implements the IJwtTalkToCeo interface to provide JWT token validation and refreshing functionality for the "Talk to CEO" application. The JwtTalkToCeoService class is responsible for validating JWT tokens, extracting claims, and refreshing access tokens as needed. It utilizes the JwtSettingsModel for configuration, the IUsersService to retrieve user information, and the IJwtService to generate new JWT tokens. This service ensures secure authentication and authorization mechanisms within the "Talk to CEO" system by managing token lifecycles effectively.
    /// </summary>
    public class JwtTalkToCeoService : IJwtTalkToCeo
    {
        private readonly JwtSettingsModel jwtSettings;
        private readonly IUsersService<UserDto> usersService;
        private readonly IJwtService jwtService;

        /// <summary>
        /// Initializes a new instance of the <see cref="JwtTalkToCeoService"/> class.
        /// </summary>
        /// <param name="jwtOptions">The JWT settings options.</param>
        /// <param name="usersService">The users service.</param>
        /// <param name="jwtService">The JWT service.</param>
        public JwtTalkToCeoService(
            IOptions<JwtSettingsModel> jwtOptions,
            IUsersService<UserDto> usersService,
            IJwtService jwtService)
        {
            this.jwtSettings = jwtOptions.Value;
            this.usersService = usersService;
            this.jwtService = jwtService;
        }

        /// <inheritdoc/>
        public async Task<string> RefreshAccessTokenAsync(string token)
        {
            try
            {
                var handler = new JwtSecurityTokenHandler();
                var jwtToken = handler.ReadJwtToken(token);

                var userId = jwtToken.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Jti)?.Value ?? jwtToken.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Jti)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    throw new DataValidationException("Missing email claim in token.");
                }

                var email = jwtToken.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Email)?.Value ?? jwtToken.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Email)?.Value;
                if (string.IsNullOrEmpty(email))
                {
                    throw new DataValidationException("Missing email claim in token.");
                }

                var userName = jwtToken.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.UniqueName)?.Value ?? jwtToken.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.UniqueName)?.Value
                            ?? string.Empty;

                if (string.IsNullOrEmpty(userName))
                {
                    throw new DataValidationException("Missing user name claim in token.");
                }

                var user = await this.usersService.GetUserFromTokenAsync(token);
                if (user == null)
                {
                    throw new DataValidationException("User not found.");
                }

                var cliams = new[]
                {
                    new Claim(JwtRegisteredClaimNames.Jti, user.Id.ToString(CultureInfo.InvariantCulture)),
                    new Claim(JwtRegisteredClaimNames.Email, user.Email),
                    new Claim(JwtRegisteredClaimNames.UniqueName,  string.Format(CultureInfo.InvariantCulture, "{0}", userName)),
                    new Claim("team", user.Team ?? string.Empty),
                };

                var jwtInfo = this.jwtService.GenerateJwtTokenInfo(cliams);
                return jwtInfo.Token;
            }
            catch (DataValidationException)
            {
                throw;
            }
            catch (Exception)
            {
                throw;
            }
        }

        /// <inheritdoc/>
        public bool TryValidateToken(string token, out ClaimsPrincipal principal, out DateTime? expiresAt)
        {
            principal = new ClaimsPrincipal(); // temporary default value
            expiresAt = null;

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(this.jwtSettings.SecretKey);

            try
            {
                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero,
                };

                principal = tokenHandler.ValidateToken(token, validationParameters, out var validatedToken);

                if (validatedToken is JwtSecurityToken jwtToken)
                {
                    var expClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "exp")?.Value;
                    if (expClaim != null && long.TryParse(expClaim, out var expUnix))
                    {
                        expiresAt = DateTimeOffset.FromUnixTimeSeconds(expUnix).UtcDateTime;
                    }
                }

                return true;
            }
            catch
            {
                principal = new ClaimsPrincipal(); // ensure non-null
                return false;
            }
        }
    }
}
