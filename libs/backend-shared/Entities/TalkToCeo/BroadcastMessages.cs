using System;
using NokAir.TalkToCeo.Shared.Entities.Common;
using NokAir.TalkToCeo.Shared.Enums;

namespace NokAir.TalkToCeo.Shared.Entities.TalkToCeo
{
    /// <summary>
    /// Represents a broadcast message in the TalkToCeo system, which can be sent by a CEO to multiple users.
    /// </summary>
    public class BroadcastMessages : AuditBase
    {
        /// <summary>
        /// Gets or sets the unique identifier for the broadcast message.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the subject of the broadcast message, which provides a brief overview of the message content.
        /// </summary>
        public string Subject { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the detailed content of the broadcast message, which may include important information or announcements from the CEO to the users.
        /// </summary>
        public string Detail { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the nonce value for the message, which can be used for security purposes to prevent replay attacks or ensure the uniqueness of the message. The DetailNonce property is intended to provide an additional layer of protection for messages by associating a unique identifier with each message, allowing the system to verify the authenticity and integrity of the message when it is processed or retrieved. The DetailTag property can be used to categorize or label messages based on specific criteria, such as topic, priority, or department, enabling easier organization and retrieval of messages within the TalkToCeo system.
        /// </summary>
        public string? DetailNonce { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the tag associated with the message, which can be used for categorization or labeling purposes. The DetailTag property allows for easy organization and retrieval of messages based on specific criteria, such as topic, priority, or department. By assigning tags to messages, users and the CEO can quickly filter and sort messages within the TalkToCeo system, improving efficiency and enabling more effective communication between users and the CEO.
        /// </summary>
        public string? DetailTag { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the detailed content of the message, including any specific information or context that the user wants to share with the CEO. This property allows users to provide a comprehensive description of their concerns, feedback, or inquiries, enabling the CEO to better understand the user's perspective and respond effectively. The ShotDetail property is intended to capture any additional details that may not be covered in the main Detail property, allowing for a more nuanced and complete communication between the user and the CEO.
        /// </summary>
        public string ShotDetail { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the unique identifier for the CEO who created and sent the broadcast message. This allows the system to associate the message with its sender and manage permissions accordingly.
        /// </summary>
        public int CeoId { get; set; }

        /// <summary>
        /// Gets or sets the status of the broadcast message, indicating whether it is still being composed (Draft) or has been finalized and sent to users (Sent). This status helps manage the lifecycle of the broadcast message and allows for features such as scheduling and editing before sending.
        /// </summary>
        public BroadcastStatus Status { get; set; }

        /// <summary>
        /// Gets or sets the date and time when the broadcast message should start being displayed to users. This allows for scheduling messages to be shown at specific times, ensuring that important announcements are delivered at the right moment.
        /// </summary>
        public DateTime StartDisplayAt { get; set; }

        /// <summary>
        /// Gets or sets the date and time when the broadcast message should stop being displayed to users. This allows for automatically hiding messages after a certain period, ensuring that outdated information is not shown to users.
        /// </summary>
        public DateTime? ExpireDisplayAt { get; set; }

        /// <summary>
        /// Gets or sets the date and time when the broadcast message was published (sent). This property is set when the message status changes to Sent, allowing for tracking when the message was made available to users and enabling features such as sorting messages by publish date or displaying the publish date in the user interface.
        /// </summary>
        public DateTime? PublishedAt { get; set; }

        /// <summary>
        /// Gets or sets the CEO who created and sent the broadcast message. This navigation property allows for easy access to the CEO's information when working with broadcast messages, enabling features such as displaying the CEO's name or profile picture alongside the message.
        /// </summary>
        public User User { get; set; } = null!;

        /// <summary>
        /// Gets or sets a collection of BroadcastMessageRead entities that represent the read status of the broadcast message for each user. This allows the system to track which users have read the message and which have not, enabling features such as marking messages as read or unread for individual users.
        /// </summary>
        public ICollection<BroadcastMessageRead> Reads { get; set; } = new List<BroadcastMessageRead>();

        /// <summary>
        /// Gets or sets a collection of BroadcastMessageAttachment entities that represent the attachments associated with the broadcast message. This allows the system to manage and display attachments alongside the broadcast message, enabling features such as downloading or viewing attached files.
        /// </summary>
        public ICollection<BroadcastMessageAttachment> Attachments { get; set; } = new List<BroadcastMessageAttachment>();
    }
}
