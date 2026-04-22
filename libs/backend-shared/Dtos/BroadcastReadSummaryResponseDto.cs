using System;

namespace NokAir.TalkToCeo.Shared.Dtos
{
    /// <summary>
    /// Defines the data transfer object for the response containing a summary of the read status of a broadcast message in the TalkToCeo application. This DTO is used to encapsulate the details of the read summary for a specific broadcast message, allowing for structured data transfer between different layers of the application. The properties of this DTO include information such as the total number of users, the count of users who have read the broadcast message, the count of users who have not read it, the percentage of users who have read it, and the timestamp of when the broadcast message was last read. This information can be used for analysis and reporting purposes to understand reader engagement with broadcast messages.
    /// </summary>
    public class BroadcastReadSummaryResponseDto
    {
        /// <summary>
        /// Gets or sets the unique identifier of the broadcast message for which the read summary is being provided. This property is used to identify the specific broadcast message in the system, allowing for tracking and analysis of reader engagement with that particular broadcast content. The BroadcastId can be used in conjunction with other properties to provide a comprehensive view of the read status of the broadcast message, such as correlating it with reader information or analyzing trends in reader engagement across different broadcast messages.
        /// </summary>
        public int BroadcastId { get; set; }

        /// <summary>
        /// Gets or sets the total number of users who are expected to read the broadcast message. This property is used to provide context for the read summary, allowing for analysis of reader engagement in relation to the total audience size. The TotalUsers can be used in conjunction with the ReadCount and UnreadCount properties to calculate the ReadPercentage, providing insights into how well the broadcast message is being received by the intended audience.
        /// </summary>
        public int TotalUsers { get; set; }

        /// <summary>
        /// Gets or sets the count of users who have read the broadcast message. This property is used to track the number of users who have engaged with the broadcast content, allowing for analysis of reader engagement and the effectiveness of the broadcast message. The ReadCount can be used in conjunction with the TotalUsers property to calculate the ReadPercentage, providing insights into how well the broadcast message is being received by the intended audience.
        /// </summary>
        public int ReadCount { get; set; }

        /// <summary>
        /// Gets or sets the count of users who have not read the broadcast message. This property is used to track the number of users who have not engaged with the broadcast content, allowing for analysis of reader engagement and the effectiveness of the broadcast message. The UnreadCount can be used in conjunction with the TotalUsers property to calculate the ReadPercentage, providing insights into how well the broadcast message is being received by the intended audience.
        /// </summary>
        public int UnreadCount { get; set; }

        /// <summary>
        /// Gets or sets the percentage of users who have read the broadcast message. This property is calculated based on the ReadCount and TotalUsers properties, providing a metric for analyzing reader engagement with the broadcast content. The ReadPercentage can be used to assess the effectiveness of the broadcast message and to identify trends in reader engagement across different broadcast messages or over time.
        /// </summary>
        public double ReadPercentage { get; set; }

        /// <summary>
        /// Gets or sets the timestamp of when the broadcast message was last read by any user. This property is used to track the timing of reader engagement with the broadcast content, allowing for analysis of when readers are most active and how they interact with the broadcast messages over time. The LastReadAt timestamp can be used to identify patterns in reader behavior, such as peak engagement times or the duration between when a broadcast message is sent and when it is read by users.
        /// </summary>
        public DateTime? LastReadAt { get; set; }
    }
}
