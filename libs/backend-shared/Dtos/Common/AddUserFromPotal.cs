namespace NokAir.TalkToCeo.Shared.Dtos.Common
{
    /// <summary>
    /// Represents a user to be added from the portal for Flight IROP (Irregular Operations) management.
    /// </summary>
    public class AddUserFromPotal
    {
        /// <summary>
        /// Gets or sets the unique identifier for the user.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the object identifier, typically used for external identity providers.
        /// </summary>
        public string ObjectId { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the user's email address.
        /// </summary>
        public string Email { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the user's first name.
        /// </summary>
        public string FirstName { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the user's last name.
        /// </summary>
        public string LastName { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the user's job title.
        /// </summary>
        public string JobTitle { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the department to which the user belongs.
        /// </summary>
        public string Department { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets a value indicating whether the user is active.
        /// </summary>
        public bool Active { get; set; }

        /// <summary>
        /// Gets or sets the roles assigned to the user, represented by their integer identifiers.
        /// </summary>
        public int[] Roles { get; set; } = Array.Empty<int>();
    }
}
