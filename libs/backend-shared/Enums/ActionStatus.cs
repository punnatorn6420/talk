namespace NokAir.TalkToCeo.Shared.Enums
{
    /// <summary>
    /// Status of an action, such as a message or notification.
    /// </summary>
    public enum ActionStatus
    {
        /// <summary>
        /// Draft status indicates that the action is still being composed or edited and has not been finalized or sent.
        /// </summary>
        Draft = 0,

        /// <summary>
        /// Sent status indicates that the action has been finalized and sent to the intended recipient(s), but has not yet been read or acknowledged.
        /// </summary>
        Sent = 1,

        /// <summary>
        /// Read status indicates that the recipient(s) have opened or viewed the action, acknowledging its receipt and content.
        /// </summary>
        Read = 2,

        /// <summary>
        /// Replied status indicates that the recipient(s) have not only read the action but have also responded to it, providing feedback, comments, or answers as necessary.
        /// </summary>
        Replied = 3,
    }
}
