using NokAir.Core.Abstractions.Entities.Rbac;

namespace NokAir.TalkToCeo.Shared.Entities.Common
{
    /// <summary>
    /// Represents a user in the system.
    /// </summary>
    public class User : IUser
    {
        /// <summary>
        /// Gets or sets unique identifier for the user in the database.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets unique identifier from the portal system.
        /// </summary>
        public string ObjectId { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets first name of the user.
        /// </summary>
        public string FirstName { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets last name of the user.
        /// </summary>
        public string LastName { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets email address of the user.
        /// </summary>
        public string Email { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets job title of the user.
        /// </summary>
        public string JobTitle { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets department the user belongs to.
        /// </summary>
        public string Department { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets a value indicating whether indicates whether the user account is active.
        /// </summary>
        public bool Active { get; set; }

        /// <summary>
        /// Gets or sets the date and time when the user was created.
        /// </summary>
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        /// <summary>
        /// Gets or sets the date and time when the user was last modified.
        /// </summary>
        public DateTime ModifiedAt { get; set; } = DateTime.Now;

        /// <summary>
        /// Gets or sets the collection of user roles associated with the user.
        /// </summary>
        public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    }
}
