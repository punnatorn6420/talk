using System;

namespace NokAir.TalkToCeo.Shared.Dtos
{
    /// <summary>
    /// Model representing a paginated list of broadcast messages in the "Talk to CEO" system. This DTO contains the total count of broadcast messages and a list of individual broadcast response DTOs. It is used to return a structured response when retrieving multiple broadcast messages, allowing clients to easily access both the total number of broadcasts and the details of each broadcast in the list.
    /// </summary>
    public class BroadcastResponseListDto
    {
        /// <summary>
        /// Gets or sets total number of messages.
        /// </summary>
        public int TotalCount { get; set; }

        /// <summary>
        /// Gets or sets list of messages.
        /// </summary>
        public List<BroadcastResponseDto> Items { get; set; } = new List<BroadcastResponseDto>();
    }
}
