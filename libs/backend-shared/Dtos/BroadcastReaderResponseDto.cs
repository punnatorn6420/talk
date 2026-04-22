using System;

namespace NokAir.TalkToCeo.Shared.Dtos
{
    /// <summary>
    /// Defines the data transfer object for the response containing information about readers of a broadcast message in the TalkToCeo application. This DTO is used to encapsulate the details of the readers who have viewed a specific broadcast message, allowing for structured data transfer between different layers of the application. The properties of this DTO can be expanded to include relevant information about the readers, such as their names, email addresses, or timestamps of when they viewed the broadcast message, depending on the requirements of the application.
    /// </summary>
    public class BroadcastReaderResponseDto
    {
        /// <summary>
        /// Gets or sets the unique identifier of the user who read the broadcast message. This property is used to identify the specific user in the system who has viewed the broadcast message, allowing for tracking and analysis of reader engagement with the broadcast content. The UserId can be used in conjunction with other properties to provide a comprehensive view of the readers and their interactions with the broadcast messages.
        /// </summary>
        public int UserId { get; set; }

        /// <summary>
        /// Gets or sets the first name of the user who read the broadcast message. This property is used to provide a more personalized and human-readable representation of the reader, allowing for better understanding and analysis of the audience engaging with the broadcast content. The FirstName can be combined with the LastName property to display the full name of the reader in various parts of the application, such as in reports or user interfaces that show reader information.
        /// </summary>
        public string FirstName { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the last name of the user who read the broadcast message. This property is used to provide a more personalized and human-readable representation of the reader, allowing for better understanding and analysis of the audience engaging with the broadcast content. The LastName can be combined with the FirstName property to display the full name of the reader in various parts of the application, such as in reports or user interfaces that show reader information.
        /// </summary>
        public string LastName { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the email address of the user who read the broadcast message. This property is used to provide contact information for the reader, allowing for potential follow-up communication or analysis of reader demographics. The Email can be used in conjunction with other properties to gain insights into the audience engaging with the broadcast content, such as identifying patterns in reader engagement based on email domains or providing personalized communication based on the reader's email address.
        /// </summary>
        public string Email { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the department of the user who read the broadcast message. This property is used to provide additional context about the reader, allowing for better understanding and analysis of the audience engaging with the broadcast content. The Department can be used to identify trends in reader engagement based on organizational units or to tailor communication and content based on the reader's department within the organization.
        /// </summary>
        public string Department { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the job title of the user who read the broadcast message. This property is used to provide additional context about the reader, allowing for better understanding and analysis of the audience engaging with the broadcast content. The JobTitle can be used to identify trends in reader engagement based on job roles or to tailor communication and content based on the reader's position within the organization.
        /// </summary>
        public string JobTitle { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the timestamp of when the user read the broadcast message. This property is used to track the timing of reader engagement with the broadcast content, allowing for analysis of when readers are most active and how they interact with the broadcast messages over time. The ReadAt timestamp can be used to identify patterns in reader behavior, such as peak engagement times or the duration between when a broadcast message is sent and when it is read by users.
        /// </summary>
        public DateTime? ReadAt { get; set; }
    }
}
