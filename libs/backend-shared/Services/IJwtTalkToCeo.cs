using System.Security.Claims;

namespace NokAir.TalkToCeo.Shared.Services
{
    /// <summary>
    /// Defines the contract for a service that handles JWT token validation and refreshing for the "Talk to CEO" application. The IJwtTalkToCeo interface provides methods for validating JWT tokens and refreshing access tokens, ensuring secure authentication and authorization mechanisms within the application. Implementations of this interface are responsible for verifying the integrity and validity of JWT tokens, extracting claims, and managing token lifecycles to maintain secure access to protected resources in the "Talk to CEO" system.
    /// </summary>
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
