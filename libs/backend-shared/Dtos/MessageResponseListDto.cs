namespace NokAir.TalkToCeo.Shared.Dtos
{
    public class MessageResponseListDto
    {
        /// <summary>
        /// Total number of messages.
        /// </summary>
        public int TotalCount { get; set; }

        /// <summary>
        /// List of messages.
        /// </summary>
        public List<MessageResponseDto> Items { get; set; } = new List<MessageResponseDto>();
    }
}
