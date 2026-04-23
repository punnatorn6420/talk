using System;
using NokAir.TalkToCeo.Shared.Entities.Common;

namespace NokAir.TalkToCeo.Shared.Entities.TalkToCeo
{
    /// <summary>
    /// Represents an attachment associated with a broadcast message in the TalkToCeo application. This entity includes properties for the attachment's ID, the ID of the associated broadcast message, the file path of the attachment, and a navigation property to the related broadcast message entity. The BroadcastMessageAttachment class inherits from AuditBase, which provides common auditing properties such as CreatedDate and CreatedBy. This allows for tracking when attachments are created and by whom, facilitating better management and organization of broadcast message attachments within the application.
    /// </summary>
    public class BroadcastMessageAttachment : AuditBase
    {
        /// <summary>
        /// Gets or sets the unique identifier for the broadcast message attachment. This property serves as the primary key for the BroadcastMessageAttachment entity, allowing for efficient retrieval and management of attachments associated with broadcast messages in the TalkToCeo application.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the ID of the associated broadcast message. This property serves as a foreign key linking the attachment to its corresponding broadcast message, enabling the application to maintain the relationship between attachments and their respective broadcast messages for better organization and retrieval of related data.
        /// </summary>
        public int BroadcastMessageId { get; set; }

        /// <summary>
        /// Gets or sets the file path of the attachment. This property stores the location of the attachment file, allowing the application to access and manage the attachment associated with a broadcast message in the TalkToCeo application. Proper handling of file paths is essential for ensuring that attachments can be retrieved and displayed correctly when needed.
        /// </summary>
        public string FilePath { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the navigation property to the related broadcast message entity. This property allows for easy access to the associated broadcast message from the attachment, facilitating better management and organization of attachments within the context of their respective broadcast messages in the TalkToCeo application. By establishing this relationship, the application can efficiently retrieve and display attachments alongside their corresponding broadcast messages when necessary.
        /// </summary>
        public BroadcastMessages BroadcastMessage { get; set; } = null!;
    }
}
