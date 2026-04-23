using System;
using System.Globalization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using NokAir.Core.Exceptions;
using NokAir.TalkToCeo.Shared.Configurations;
using NokAir.TalkToCeo.Shared.Dtos;
using NokAir.TalkToCeo.Shared.Entities.TalkToCeo;
using NokAir.TalkToCeo.Shared.Repositories;

namespace NokAir.TalkToCeo.Shared.Services
{
    /// <summary>
    /// Implements the broadcast attachment service for the TalkToCeo application. This service is responsible for managing the storage of files associated with broadcast messages, allowing for efficient management of attachments while keeping the business logic separate from the data access logic. The BroadcastAttachmentService class implements the IBroadcastAttachmentService interface, providing the actual logic for storing files as attachments for specific broadcast messages. The StoreFilesForBroadcastAsync method will handle the specifics of how the files are stored, such as saving them to a file system or cloud storage, and will return the paths where the attachments can be accessed. This allows for efficient management of broadcast message attachments while keeping the business logic separate from the data access logic.
    /// </summary>
    public class BroadcastAttachmentService : IBroadcastAttachmentService
    {
        private readonly IWebHostEnvironment env;

        private readonly TalkToCeoDbContext dbContext;

        private readonly IBroadcastAttachmentRepository attachmentRepository;

        private readonly IBroadcastRepository broadcastRepository;

        private readonly FileUploadOptions fileOptions;

        /// <summary>
        /// Initializes a new instance of the <see cref="BroadcastAttachmentService"/> class with the specified dependencies. The constructor takes several parameters, including the web host environment for accessing the file system, the database context for interacting with TalkToCeo data, repositories for managing broadcast attachments and broadcast messages, and file upload options for configuring allowed file types and other settings. This allows the service to perform operations such as storing files as attachments for specific broadcast messages while ensuring that the files meet the defined criteria for allowed types and sizes. By injecting these dependencies through the constructor, we can easily manage dependencies and promote better testability of the service class.
        /// </summary>
        /// <param name="env">The web host environment for accessing the file system.</param>
        /// <param name="dbContext">The database context for interacting with TalkToCeo data.</param>
        /// <param name="attachmentRepository">The repository for managing broadcast attachments.</param>
        /// <param name="broadcastRepository">The repository for managing broadcast messages.</param>
        /// <param name="fileOptions">The file upload options for configuring allowed file types and other settings.</param>
        public BroadcastAttachmentService(
            IWebHostEnvironment env,
            TalkToCeoDbContext dbContext,
            IBroadcastAttachmentRepository attachmentRepository,
            IBroadcastRepository broadcastRepository,
            IOptions<FileUploadOptions> fileOptions)
        {
            this.env = env;
            this.dbContext = dbContext;
            this.attachmentRepository = attachmentRepository;
            this.broadcastRepository = broadcastRepository;
            this.fileOptions = fileOptions.Value;
        }

        /// <inheritdoc/>
        public async Task<(string FullPath, string FileName)?> GetDownloadFileAsync(int broadcastId, int attachmentId)
        {
            var attachment =
                await this.attachmentRepository
                    .FindAttachmentByIdAsync(
                        broadcastId,
                        attachmentId);

            if (attachment == null)
            {
                return null;
            }

            if (attachment.BroadcastMessageId != broadcastId)
            {
                return null;
            }

            var fullPath =
                Path.Combine(
                    this.env.WebRootPath,
                    attachment.FilePath);

            if (!File.Exists(fullPath))
            {
                return null;
            }

            return (fullPath, Path.GetFileName(fullPath));
        }

        /// <inheritdoc/>
        public async Task RemoveAttachmentAsync(int broadcastId, int attachmentId)
        {
            var attachment =
                await this.attachmentRepository
                    .FindAttachmentByIdAsync(
                        broadcastId,
                        attachmentId);

            if (attachment == null)
            {
                throw new DataValidationException(
                    "Attachment not found");
            }

            if (attachment.BroadcastMessageId != broadcastId)
            {
                throw new DataValidationException(
                    "Attachment does not belong to this broadcast");
            }

            var fullPath =
                Path.Combine(
                    this.env.WebRootPath,
                    attachment.FilePath);

            if (File.Exists(fullPath))
            {
                File.Delete(fullPath);
            }

            await this.attachmentRepository
                .RemoveBroadcastAttachmentAsync(
                    attachment);

            await this.dbContext.SaveChangesAsync();
        }

        /// <inheritdoc/>
        public async Task<List<string>> StoreFilesForBroadcastAsync(
          int broadcastId,
          IFormFileCollection files,
          UserDto user)
        {
            var broadcast =
                await this.broadcastRepository
                    .FindBroadcastMessageByIdAsync(broadcastId);

            if (broadcast == null)
            {
                throw new DataValidationException("Broadcast not found");
            }

            var allowedExtensions =
                new HashSet<string>(
                    this.fileOptions.AllowedExtensions,
                    StringComparer.OrdinalIgnoreCase);

            var folderPath =
                Path.Combine(
                    this.env.WebRootPath,
                    this.fileOptions.FolderBroadcastAttachment,
                    "broadcast",
                    broadcastId.ToString(CultureInfo.InvariantCulture));

            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }

            var attachments =
                new List<BroadcastMessageAttachment>();

            var uploadedFiles =
                new List<string>();

            foreach (var file in files)
            {
                if (file.Length == 0)
                {
                    continue;
                }

                var extension =
                    Path.GetExtension(file.FileName);

                if (!allowedExtensions.Contains(extension))
                {
                    throw new DataValidationException(
                        $"File type not allowed: {extension}");
                }

                var maxFileSizeBytes =
                    this.fileOptions.MaxFileSizeMB * 1024 * 1024;

                if (file.Length > maxFileSizeBytes)
                {
                    throw new DataValidationException(
                        $"File too large: {file.FileName}");
                }

                var originalFileName =
                    Path.GetFileNameWithoutExtension(file.FileName);

                var timestamp =
                    DateTime.Now.ToString(
                        "yyyy_MM_dd HH-mm-ss",
                        CultureInfo.InvariantCulture);

                var safeFileName =
                    $"{originalFileName}_{timestamp}{extension}";

                var fullPath =
                    Path.Combine(folderPath, safeFileName);

                using var stream =
                    new FileStream(fullPath, FileMode.Create);

                await file.CopyToAsync(stream);

                var relativePath =
                    Path.Combine(
                        this.fileOptions.FolderBroadcastAttachment,
                        "broadcast",
                        broadcastId.ToString(CultureInfo.InvariantCulture),
                        safeFileName);

                var userNameAcc =
                    (user?.FirstName ?? string.Empty)
                    + " "
                    + (user?.LastName ?? string.Empty);

                attachments.Add(
                    new BroadcastMessageAttachment
                    {
                        BroadcastMessageId = broadcastId,
                        FilePath = relativePath,
                        CreatedBy = userNameAcc,
                        ModifiedBy = userNameAcc,
                    });

                uploadedFiles.Add(relativePath);
            }

            await this.attachmentRepository.AddRangeAsync(attachments);

            await this.dbContext.SaveChangesAsync();

            return uploadedFiles;
        }
    }
}
