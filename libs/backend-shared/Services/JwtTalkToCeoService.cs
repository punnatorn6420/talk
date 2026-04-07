using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.Logging;
using NokAir.Core.Exceptions;
using System.Security.Claims;
using System.Globalization;
using NokAir.TalkToCeo.Shared.Dtos;
using NokAir.Shared.Security.Models.Common;
using NokAir.Shared.Security.Services.InHouse;
using Microsoft.Extensions.Options;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace NokAir.TalkToCeo.Shared.Services
{
    public class JwtTalkToCeoService : IJwtTalkToCeo
    {
        private readonly JwtSettingsModel jwtSettings;
        private readonly IUsersService<UserDto> usersService;
        private readonly IJwtService jwtService;

        public JwtTalkToCeoService(
            IOptions<JwtSettingsModel> jwtOptions,
            IUsersService<UserDto> usersService,
            IJwtService jwtService)
        {
            this.jwtSettings = jwtOptions.Value;
            this.usersService = usersService;
            this.jwtService = jwtService;
        }

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
            catch (DataValidationException ex)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

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
