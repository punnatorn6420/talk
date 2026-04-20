using System;
using NokAir.TalkToCeo.Shared.Entities.Common;
using NokAir.TalkToCeo.Shared.Enums;

namespace NokAir.TalkToCeo.Shared.Entities.TalkToCeo
{
    /// <summary>
    /// Represents a message exchanged between a user and the CEO.
    /// </summary>
    public class Messages : AuditBase
    {
        /// <summary>
        /// Gets or sets the unique identifier for the message.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the date and time when the message was posted.
        /// </summary>
        public DateTime PostedAt { get; set; }

        /// <summary>
        /// Gets or sets the subject of the message.
        /// </summary>s
        public string Subject { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the detailed content of the message.
        /// </summary>
        public string Detail { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the reply from the CEO, if any.
        /// </summary>
        public string? CeoReply { get; set; }

        /// <summary>
        /// Gets or sets the identifier of the CEO to whom the message is directed, if applicable.
        /// </summary>
        public int? CeoId { get; set; }

        /// <summary>
        /// Gets or sets the identifier of the user who posted the message.
        /// </summary>
        public int UserId { get; set; }

        /// <summary>
        /// Gets or sets the status of the message, indicating whether it is pending, read, or replied to.
        /// </summary>
        public ActionStatus Status { get; set; }

        /// <summary>
        /// Gets or sets the date and time when the message was read by the CEO, if applicable.
        /// </summary>
        public DateTime? ReadAt { get; set; }

        /// <summary>
        /// Gets or sets the date and time when the CEO replied to the message, if applicable.
        /// </summary>
        public DateTime? RepliedAt { get; set; }

        /// <summary>
        /// Gets or sets the user who posted the message, establishing a relationship between the Messages entity and the User entity. This allows for easy access to the user's information when retrieving messages, enabling features such as displaying the user's name or contact details alongside their message.
        /// </summary>
        public User User { get; set; } = null!;

        /// <summary>
        /// Gets or sets the CEO to whom the message is directed, establishing a relationship between the Messages entity and the User entity. This allows for easy access to the CEO's information when retrieving messages, enabling features such as displaying the CEO's name or contact details alongside their reply. The CEO property is nullable, indicating that a message may not always be directed to a specific CEO, allowing for flexibility in handling messages that may not require a CEO response or are intended for general inquiries.
        /// </summary>
        public User? Ceo { get; set; }

        /// <summary>
        /// Gets or sets the collection of attachments associated with the message, establishing a relationship between the Messages entity and the MessageAttachment entity. This allows for easy access to all attachments related to a specific message, enabling features such as displaying attachment details or providing download links when retrieving messages. The Attachments property is initialized as an empty list to ensure that it is always ready to hold any attachments that may be added to the message, preventing null reference issues and allowing for seamless management of attachments within the TalkToCeo system.
        /// </summary>
        public ICollection<MessageAttachment> Attachments { get; set; } = new List<MessageAttachment>();
    }
}
