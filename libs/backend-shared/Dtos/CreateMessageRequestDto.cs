using System.Text.Json.Serialization;
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
        /// Gets or sets the ID of the user creating the message.
        /// </summary>
        [JsonIgnore]
        public int UserId { get; set; }

        /// <summary>
        /// Gets or sets the name of the user creating the message.
        /// </summary>
        [JsonIgnore]
        public string UserName { get; set; } = string.Empty;
    }
}
