using System;
using NokAir.TalkToCeo.Shared.Entities.Common;

namespace NokAir.TalkToCeo.Shared.Entities.TalkToCeo
{
    /// <summary>
    /// Represents the read status of a broadcast message for a specific user in the TalkToCeo system. This entity allows the system to track which users have read a particular broadcast message, enabling features such as marking messages as read or unread for individual users and providing insights into user engagement with broadcast messages over time.
    /// </summary>
    public class BroadcastMessageRead
    {
        /// <summary>
        /// Gets or sets the unique identifier for the BroadcastMessageRead entity, which represents the read status of a broadcast message for a specific user. This allows the system to track which users have read a particular broadcast message, enabling features such as marking messages as read or unread for individual users.
        /// </summary>
        public int BroadcastMessageId { get; set; }

        /// <summary>
        /// Gets or sets the unique identifier for the user who has read the broadcast message. This allows the system to associate the read status of a broadcast message with a specific user, enabling features such as tracking which users have read a particular message and providing personalized notifications or reminders for unread messages.
        /// </summary>
        public int UserId { get; set; }

        /// <summary>
        /// Gets or sets the date and time when the user read the broadcast message. This allows the system to track when a user has read a particular message, enabling features such as displaying the read timestamp for each user or providing insights into user engagement with broadcast messages over time.
        /// </summary>
        public DateTime ReadAt { get; set; }

        /// <summary>
        /// Gets or sets the BroadcastMessages entity that represents the broadcast message associated with this read status. This navigation property allows for easy access to the details of the broadcast message when working with BroadcastMessageRead entities, enabling features such as displaying the message content or subject alongside the read status for each user.
        /// </summary>
        public BroadcastMessages BroadcastMessage { get; set; } = null!;

        /// <summary>
        /// Gets or sets the User entity that represents the user associated with this read status. This navigation property allows for easy access to the details of the user when working with BroadcastMessageRead entities, enabling features such as displaying the user's name or profile picture alongside the read status for each broadcast message.
        /// </summary>
        public User User { get; set; } = null!;
    }
}
