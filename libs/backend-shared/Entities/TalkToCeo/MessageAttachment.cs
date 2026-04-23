using System;
using NokAir.TalkToCeo.Shared.Entities.Common;
using NokAir.TalkToCeo.Shared.Enums;

namespace NokAir.TalkToCeo.Shared.Entities.TalkToCeo
{
    /// <summary>
    /// Represents an attachment associated with a message in the TalkToCeo system.
    /// </summary>
    public class MessageAttachment : AuditBase
    {
        /// <summary>
        /// Gets or sets the unique identifier for the message attachment.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the unique identifier for the message to which this attachment belongs.
        /// </summary>
        public int MessageId { get; set; }

        /// <summary>
        /// Gets or sets the original file name of the attachment as uploaded by the user.
        /// </summary>
        public string FilePath { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the type of the owner of the attachment, indicating whether it belongs to a message or a CEO reply.
        /// </summary>
        public AttachmentOwnerType OwnerType { get; set; }

        /// <summary>
        /// Gets or sets the message to which this attachment belongs.
        /// </summary>
        public Messages Message { get; set; } = null!;
    }
}
