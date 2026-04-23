using System;
using NokAir.TalkToCeo.Shared.Enums;

namespace NokAir.TalkToCeo.Shared.Dtos
{
    /// <summary>
    /// Data Transfer Object representing a message in the "Talk to CEO" system. This DTO is used for transferring message data between the API and the service layer.
    /// </summary>
    public class MessageResponseDto
    {
        /// <summary>
        /// Gets or sets the unique identifier for the message. This ID is used to reference the message in various operations such as retrieval, updating, and deletion.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the subject of the message. This field is used to provide a brief overview of the message content and is typically displayed in message listings and summaries.
        /// </summary>
        public string Subject { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the content of the message. This field contains the main body of the message, which may include user feedback, questions, or any other communication intended for the CEO. The content is expected to be a string and can be of varying length depending on the user's input.
        /// </summary>
        public string Message { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the reply to the message. This field contains the response from the CEO or the responsible team addressing the user's message. The reply is expected to be a string and can be of varying length depending on the nature of the response. If a message has not been replied to yet, this property may be set to a default value or left null, depending on the implementation of the service layer.
        /// </summary>
        public string? Reply { get; set; }

        /// <summary>
        /// Gets or sets the status of the message. This field indicates the current state of the message, such as whether it is new, in progress, or resolved. The status is represented by an enumeration (ActionStatus) that defines the possible states a message can be in, allowing for consistent handling of message statuses throughout the application.
        /// </summary>
        public ActionStatus Status { get; set; }

        /// <summary>
        /// Gets or sets the email address of the user who sent the message. This information is important for contacting the user and for tracking the origin of the message. The Email property is a string that stores the user's email address, allowing for easy identification and communication with the message sender.
        /// </summary>
        public string Email { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the job title of the user who sent the message. This information provides context about the user's role within the organization and can be useful for understanding the perspective from which the message was sent. The JobTitle property is a string that stores the user's job title, allowing for easy identification of the user's position within the company.
        /// </summary>
        public string JobTitle { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the department of the user who sent the message. This information provides additional context about the user's role within the organization and can be useful for understanding the perspective from which the message was sent. The Department property is a string that stores the user's department, allowing for easy identification of the user's organizational unit within the company.
        /// </summary>
        public string Department { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the full name of the user who sent the message. This information provides a complete identification of the user and can be useful for addressing the user in communications. The FullName property is a string that stores the user's full name, allowing for easy identification of the message sender.
        /// </summary>
        public string FullName { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the list of attachments associated with the message. This property contains a collection of MessageAttachmentDto objects, each representing an attachment that is linked to the message. The Attachments property allows for the inclusion of additional files or documents that may be relevant to the message content, providing a more comprehensive context for the communication between the user and the CEO. Each MessageAttachmentDto includes details such as the attachment's unique identifier and file name, enabling easy management and display of attachments in the frontend or other layers of the application.
        /// </summary>
        public List<MessageAttachmentDto> UserAttachments { get; set; } = new();

        /// <summary>
        /// Gets or sets the list of attachments associated with the CEO's reply to the message. This property contains a collection of MessageAttachmentDto objects, each representing an attachment that is linked to the CEO's response. The CeoAttachments property allows for the inclusion of additional files or documents that may be relevant to the CEO's reply, providing a more comprehensive context for the communication between the user and the CEO. Each MessageAttachmentDto includes details such as the attachment's unique identifier and file name, enabling easy management and display of attachments in the frontend or other layers of the application.
        /// </summary>
        public List<MessageAttachmentDto> CeoAttachments { get; set; } = new();

        /// <summary>
        /// Gets or sets the date and time when the message was posted. This timestamp is crucial for tracking when the message was created and can be used for sorting, filtering, and displaying the message in chronological order. The PostedAt property is of type DateTime, which allows it to store both the date and time information accurately.
        /// </summary>
        public DateTime PostedAt { get; set; }

        /// <summary>
        /// Gets or sets the date and time when the message was replied to. This timestamp is important for tracking the response time and for displaying the message in chronological order based on when it was replied to. The RepliedAt property is of type DateTime, which allows it to store both the date and time information accurately. If a message has not been replied to yet, this property may be set to a default value or left null, depending on the implementation of the service layer.
        /// </summary>
        public DateTime RepliedAt { get; set; }

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
