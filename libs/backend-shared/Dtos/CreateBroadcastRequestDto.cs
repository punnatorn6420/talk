using System;
using System.Runtime.CompilerServices;
using Microsoft.AspNetCore.Http;
using NokAir.TalkToCeo.Shared.Entities.Common;
using NokAir.TalkToCeo.Shared.Enums;

namespace NokAir.TalkToCeo.Shared.Dtos
{
    /// <summary>
    /// DTO for creating a broadcast message. This class contains the necessary properties to create a new broadcast, including the subject, detail, display date, pin status, and action status.
    /// </summary>
    public class CreateBroadcastRequestDto
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
        public DateTime StartDisplayAt { get; set; }

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
        public BroadcastStatus Status { get; set; } = BroadcastStatus.Draft;

        /// <summary>
        /// Gets or sets the collection of files attached to the message. This property is used to hold any files that the user may want to include with their message, such as screenshots, documents, or other relevant files. The attachments are represented as an IFormFileCollection, which allows for multiple files to be uploaded and processed by the backend when the message is created.
        /// </summary>
        public IFormFileCollection? Attachments { get; set; }
    }
}
