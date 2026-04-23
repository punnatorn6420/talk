namespace NokAir.TalkToCeo.Shared.Configurations
{
    /// <summary>
    /// Represents the configuration options for file uploads in the TalkToCeo system. This class contains properties that define the allowed file extensions and the maximum file size (in megabytes) for uploaded files. These options can be used to validate and control the file upload process, ensuring that only files that meet the specified criteria are accepted by the system.
    /// </summary>
    public class FileUploadOptions
    {
        /// <summary>
        /// Gets or sets the base folder path where uploaded files will be stored. This property is used to specify the root directory for file storage, allowing the system to organize and manage uploaded files in a consistent location on the server or cloud storage. The value of this property can be configured to point to a specific folder or directory structure based on the application's requirements.
        /// </summary>
        public string BaseFolder { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the folder path for storing broadcast attachments. This property is used to specify the subdirectory within the base folder where files associated with broadcast messages will be stored. By defining a specific folder for broadcast attachments, the system can better organize and manage files related to broadcasts, making it easier to retrieve and maintain them as needed.
        /// </summary>
        public string FolderBroadcastAttachment { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the list of allowed file extensions for uploaded files. This property is used to validate the file type of uploaded files and ensure that only files with specified extensions are accepted by the system.
        /// </summary>
        public List<string> AllowedExtensions { get; set; } = new();

        /// <summary>
        /// Gets or sets the maximum allowed file size for uploaded files, measured in megabytes (MB). This property is used to validate the size of uploaded files and ensure that they do not exceed the specified limit, helping to manage storage and prevent excessively large files from being uploaded to the system.
        /// </summary>
        public int MaxFileSizeMB { get; set; }
    }
}
