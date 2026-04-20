using System;

namespace NokAir.TalkToCeo.Shared.Dtos
{
    /// <summary>
    /// DTO for message attachments in the "Talk to CEO" system. This class contains properties for the attachment ID and file name. It is used to encapsulate the data related to message attachments and send it to the frontend or other layers of the application as needed. The MessageAttachmentDto allows for a clear and structured way to represent attachment information associated with messages in the system.
    /// </summary>
    public class MessageAttachmentDto
    {
        /// <summary>
        /// Gets or sets the unique identifier for the message attachment. This ID is used to reference the attachment in the system and can be used for operations such as retrieval, deletion, or association with messages. The Id property is of type int, which allows it to store a numeric identifier for each attachment.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the file name of the attachment. This property stores the name of the file as it was uploaded by the user, which can be used for display purposes in the frontend or for reference in the backend. The FileName property is a string that holds the name of the attachment file, allowing users and administrators to easily identify and manage attachments associated with messages in the "Talk to CEO" system.
        /// </summary>
        public string FileName { get; set; } = string.Empty;
    }
}
