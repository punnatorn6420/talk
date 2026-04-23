using System;

namespace NokAir.TalkToCeo.Shared.Enums
{
    /// <summary>
    /// Defines the type of the owner of an attachment, indicating whether it belongs to a user message or a CEO reply.
    /// </summary>
    public enum AttachmentOwnerType
    {
        /// <summary>
        /// Indicates that the attachment belongs to a user message, which is the original message sent by the user to the CEO.
        /// </summary>
        User = 1,

        /// <summary>
        /// Indicates that the attachment belongs to a CEO reply, which is the response message sent by the CEO back to the user.
        /// </summary>
        Ceo = 2,
    }
}
