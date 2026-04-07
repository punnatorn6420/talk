namespace NokAir.TalkToCeo.Shared.Entities.Common
{
    /// <summary>
    /// Base class for audit information in entities.
    /// </summary>
    public class AuditBase
    {
        /// <summary>
        /// Gets or sets the user who created record.
        /// </summary>
        public string CreatedBy { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the user who last modified record.
        /// </summary>
        public string ModifiedBy { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the date and time when the record was created.
        /// </summary>
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        /// <summary>
        /// Gets or sets the date and time when the record was last modified.
        /// </summary>
        public DateTime ModifiedAt { get; set; } = DateTime.Now;
    }
}
