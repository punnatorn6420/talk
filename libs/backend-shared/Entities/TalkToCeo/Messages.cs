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
        /// Gets or sets the reply from the CEO, if any.
        /// </summary>
        public string? CeoReply { get; set; }

        /// <summary>
        /// Gets or sets the nonce value for the CEO's reply, which can be used for security purposes to prevent replay attacks or ensure the uniqueness of the reply. The CeoReplyNonce property is intended to provide an additional layer of protection for CEO replies by associating a unique identifier with each reply, allowing the system to verify the authenticity and integrity of the reply when it is processed or retrieved. The CeoReplyTag property can be used to categorize or label CEO replies based on specific criteria, such as topic, priority, or department, enabling easier organization and retrieval of replies within the TalkToCeo system.
        /// </summary>
        public string? CeoReplyNonce { get; set; }

        /// <summary>
        /// Gets or sets the tag associated with the CEO's reply, which can be used for categorization or labeling purposes. The CeoReplyTag property allows for easy organization and retrieval of CEO replies based on specific criteria, such as topic, priority, or department. By assigning tags to CEO replies, users and the CEO can quickly filter and sort replies within the TalkToCeo system, improving efficiency and enabling more effective communication between users and the CEO.
        /// </summary>
        public string? CeoReplyTag { get; set; }

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
