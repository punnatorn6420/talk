using System;
using System.Runtime.CompilerServices;
using NokAir.TalkToCeo.Shared.Entities.Common;
using NokAir.TalkToCeo.Shared.Enums;

namespace NokAir.TalkToCeo.Shared.Dtos
{
    /// <summary>
    /// DTO for updating a broadcast message. This class contains the necessary properties to update an existing broadcast, including the subject, detail, display date, pin status, and action status.
    /// </summary>
    public class UpdateBroadcastRequestDto
    {
        /// <summary>
        /// Gets or sets the subject of the broadcast message, which provides a brief summary or title for the content being broadcasted. This field is required and should not be empty, as it helps recipients quickly understand the purpose of the broadcast.
        /// </summary>
        public string Subject { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the detailed content of the broadcast message. This field provides more in-depth information about the broadcast and is optional.
        /// </summary>
        public string Detail { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the date and time when the broadcast message should start being displayed. This field is required and helps schedule the broadcast appropriately.
        /// </summary>
        public DateTime StartDisplayDate { get; set; }

        /// <summary>
        /// Gets or sets the date and time when the broadcast message should stop being displayed. This field is required and helps ensure that the broadcast is only visible for a specified duration, preventing outdated information from being shown to recipients. The ExpireDisplayAt property is of type DateTime?, which allows it to store both the date and time information accurately, ensuring that the broadcast is displayed and hidden at the correct times as intended by the creator.
        /// </summary>
        public DateTime? ExpireDisplayAt { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether the broadcast message is pinned. Pinned messages are given higher visibility and are typically displayed at the top of the list.
        /// </summary>
        public bool IsPinned { get; set; }

        /// <summary>
        /// Gets or sets the current status of the broadcast message. This field helps track the lifecycle of the broadcast, such as whether it is in draft, published, or archived state.
        /// </summary>
        public BroadcastStatus Status { get; set; }

        /// <summary>
        /// Gets or sets the date and time when the message was created. This timestamp is crucial for tracking when the message was created and can be used for sorting, filtering, and displaying the message in chronological order. The CreatedAt property is of type DateTime, which allows it to store both the date and time information accurately. Additionally, this property can be used for auditing purposes to keep a record of when messages were created in the system.
        /// </summary>
        public DateTime CreatedAt { get; set; }

        /// <summary>
        /// Gets or sets the date and time when the message was last modified. This timestamp is important for tracking changes to the message and for displaying the message in chronological order based on when it was last updated. The ModifiedAt property is of type DateTime, which allows it to store both the date and time information accurately. This property can also be used for auditing purposes to keep a record of when messages were modified in the system.
        /// </summary>
        public DateTime ModifiedAt { get; set; }

        /// <summary>
        /// Gets or sets the username of the user who created the message. This information is important for tracking who initiated the communication and can be used for auditing purposes. The CreatedBy property is a string that stores the username of the creator, allowing for easy identification of the message's originator in the system. Similarly, the ModifiedBy property stores the username of the last user who modified the message, providing a clear record of who made changes to the message over time.
        /// </summary>
        public string CreatedBy { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the username of the user who last modified the message. This information is important for tracking who made the most recent changes to the message and can be used for auditing purposes. The ModifiedBy property is a string that stores the username of the last modifier, allowing for easy identification of who updated the message in the system. This helps maintain a clear record of changes and accountability for modifications made to messages over time.
        /// </summary>
        public string ModifiedBy { get; set; } = string.Empty;
    }
}
