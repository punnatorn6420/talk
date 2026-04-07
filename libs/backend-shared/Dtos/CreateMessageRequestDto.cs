
using System.Text.Json.Serialization;
using NokAir.TalkToCeo.Shared.Enums;
namespace NokAir.TalkToCeo.Shared.Dtos
{
    public class CreateMessageRequestDto
    {
        /// <summary>
        /// Message subject
        /// </summary>
        public string Subject { get; set; } = string.Empty;

        /// <summary>
        /// Message detail
        /// </summary>
        public string Detail { get; set; } = string.Empty;

        /// <summary>
        /// Message status
        /// </summary>
        public ActionStatus Status { get; set; } = ActionStatus.Draft;

        [JsonIgnore]
        public int UserId { get; set; }

        [JsonIgnore]
        public string UserName { get; set; } = string.Empty;
    }
}
