using System;

namespace NokAir.TalkToCeo.Shared.Dtos
{
    /// <summary>
    /// DTO for replying to a message in the "Talk to CEO" system. This class contains a single property for the reply message, which is used to encapsulate the data required to send a reply to an existing message and process it in the backend.
    /// </summary>
    public class ReplyMessageRequestDto
    {
        /// <summary>
        /// Gets or sets the reply message.
        /// </summary>
        public string Reply { get; set; } = string.Empty;
    }
}
