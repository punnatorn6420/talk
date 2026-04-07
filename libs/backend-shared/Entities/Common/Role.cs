using NokAir.Core.Abstractions.Entities.Rbac;

namespace NokAir.TalkToCeo.Shared.Entities.Common
{
    /// <summary>
    /// Represents a role within the system.
    /// </summary>
    public class Role : IRole
    {
        /// <summary>
        /// Gets or sets the unique identifier for the role.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the name of the role.
        /// </summary>
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets a value indicating whether the role is active.
        /// </summary>
        public bool Active { get; set; } = true;

        /// <summary>
        /// Gets or sets the date and time when the role was created.
        /// </summary>
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        /// <summary>
        /// Gets or sets the date and time when the role was last modified.
        /// </summary>
        public DateTime ModifiedAt { get; set; } = DateTime.Now;

        /// <summary>
        /// Gets or sets the collection of user roles.
        /// </summary>
        public required ICollection<UserRole> UserRoles { get; set; }
    }
}
