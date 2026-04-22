using System;

namespace NokAir.TalkToCeo.Shared.Enums
{
    /// <summary>
    /// Defines the status of a broadcast message in the TalkToCeo system. This enum is used to indicate whether a broadcast message is still being composed (Draft) or has been finalized and sent to users (Sent). The BroadcastStatus enum helps manage the lifecycle of broadcast messages, allowing for features such as scheduling, editing, and tracking the status of messages within the application.
    /// </summary>
    public enum BroadcastStatus
    {
        /// <summary>
        /// Draft status indicates that the action is still being composed or edited and has not been finalized or sent.
        /// </summary>
        Draft = 0,

        /// <summary>
        /// Sent status indicates that the action has been finalized and sent to the intended recipient(s), but has not yet been read or acknowledged.
        /// </summary>
        Sent = 1,
    }
}
