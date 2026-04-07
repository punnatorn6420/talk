namespace NokAir.TalkToCeo.Shared.Dtos
{
    /// <summary>
    /// Represents a user in the TalkToCeo system.
    /// </summary>
    public class UserDto
    {
        /// <summary>
        /// Gets or sets the unique identifier for the user.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the object identifier (e.g., from an identity provider).
        /// </summary>
        public string ObjectId { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the user's first name.
        /// </summary>
        public string FirstName { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the user's last name.
        /// </summary>
        public string LastName { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the user's email address.
        /// </summary>
        public string Email { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the user's job title.
        /// </summary>
        public string JobTitle { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the user's department.
        /// </summary>
        public string Department { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets a value indicating whether the user is active.
        /// </summary>
        public bool Active { get; set; }

        /// <summary>
        /// Gets or sets the list of roles assigned to the user.
        /// </summary>
        public List<string> Roles { get; set; } = new();

        /// <summary>
        /// Gets or sets the user's team.
        /// </summary>
        public string? Team { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the date and time when the user was created.
        /// </summary>
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        /// <summary>
        /// Gets or sets the date and time when the user was last modified.
        /// </summary>
        public DateTime ModifiedAt { get; set; } = DateTime.Now;
    }
}
