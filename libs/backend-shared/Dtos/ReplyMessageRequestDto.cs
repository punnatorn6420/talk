using System;
using Newtonsoft.Json;

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

        /// <summary>
        /// Gets or sets the name of the user creating the message.
        /// </summary>
        [JsonIgnore]
        public string UserName { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the CEO ID to which the reply is directed. This property is used to identify the specific CEO that the reply message is intended for, allowing the system to route the reply appropriately and ensure that it reaches the correct recipient within the "Talk to CEO" application.
        /// </summary>
        [JsonIgnore]
        public int CeoId { get; set; }
    }
}
