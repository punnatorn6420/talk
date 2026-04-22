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
        /// Gets or sets the CEO who created and sent the broadcast message. This navigation property allows for easy access to the CEO's information when working with broadcast messages, enabling features such as displaying the CEO's name or profile picture alongside the message.
        /// </summary>
        public User User { get; set; } = null!;

        /// <summary>
        /// Gets or sets a collection of BroadcastMessageRead entities that represent the read status of the broadcast message for each user. This allows the system to track which users have read the message and which have not, enabling features such as marking messages as read or unread for individual users.
        /// </summary>
        public ICollection<BroadcastMessageRead> Reads { get; set; } = new List<BroadcastMessageRead>();
    }
}
