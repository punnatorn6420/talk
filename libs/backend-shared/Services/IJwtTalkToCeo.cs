using System.Security.Claims;
namespace NokAir.TalkToCeo.Shared.Services
{
    public interface IJwtTalkToCeo
    {
        /// <summary>
        /// Attempts to validate the specified JWT token.
        /// </summary>
        /// <param name="token">The JWT token to validate.</param>
        /// <param name="principal">
        /// When this method returns, contains the <see cref="ClaimsPrincipal"/> extracted from the token if validation succeeded; otherwise, <c>null</c>.
        /// </param>
        /// <param name="expiresAt">
        /// When this method returns, contains the expiration date and time of the token if validation succeeded; otherwise, <c>null</c>.
        /// </param>
        /// <returns>
        /// <c>true</c> if the token is valid; otherwise, <c>false</c>.
        /// </returns>
        bool TryValidateToken(string token, out ClaimsPrincipal principal, out DateTime? expiresAt);

        /// <summary>
        /// Asynchronously refreshes the access token using the specified JWT token.
        /// </summary>
        /// <param name="token">The JWT token to refresh.</param>
        /// <returns>
        /// A task that represents the asynchronous operation. The task result contains the refreshed JWT token as a string.
        /// </returns>
        Task<string> RefreshAccessTokenAsync(string token);
    }
}
