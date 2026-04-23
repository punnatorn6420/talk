using System;
using Microsoft.AspNetCore.Http;
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
        /// Gets or sets the collection of files attached to the reply message. This property is used to hold any files that the user may want to include with their reply, such as screenshots, documents, or other relevant files. The attachments are represented as an IFormFileCollection, which allows for multiple files to be uploaded and processed by the backend when the reply message is created.
        /// </summary>
        public IFormFileCollection? Attachments { get; set; }
    }
}
