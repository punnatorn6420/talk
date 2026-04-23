using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Http;
using NokAir.TalkToCeo.Shared.Enums;

namespace NokAir.TalkToCeo.Shared.Dtos
{
    /// <summary>
    /// DTO for creating a new message in the "Talk to CEO" system. This class contains properties for the message subject, detail, status, and user information. It is used to encapsulate the data required to create a new message and send it to the backend for processing.
    /// </summary>
    public class CreateMessageRequestDto
    {
        /// <summary>
        /// Gets or sets message subject.
        /// </summary>
        public string Subject { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets message detail.
        /// </summary>
        public string Detail { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets message status.
        /// </summary>
        public ActionStatus Status { get; set; } = ActionStatus.Draft;

        /// <summary>
        /// Gets or sets the collection of files attached to the message. This property is used to hold any files that the user may want to include with their message, such as screenshots, documents, or other relevant files. The attachments are represented as an IFormFileCollection, which allows for multiple files to be uploaded and processed by the backend when the message is created.
        /// </summary>
        public IFormFileCollection? Attachments { get; set; }
    }
}
