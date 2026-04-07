namespace NokAir.TalkToCeo.Shared.Dtos
{
    /// <summary>
    /// Represents a role within the system.
    /// </summary>
    public class RoleDto
    {
        /// <summary>
        /// Gets or sets the unique identifier for the IROP role.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the name of the IROP role.
        /// </summary>
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets a value indicating whether the IROP role is active.
        /// </summary>
        public bool Active { get; set; }

        /// <summary>
        /// Gets or sets the creation timestamp of the IROP role.
        /// </summary>
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        /// <summary>
        /// Gets or sets the last update timestamp of the IROP role.
        /// </summary>
        public DateTime LastUpdate { get; set; } = DateTime.Now;
    }
}
