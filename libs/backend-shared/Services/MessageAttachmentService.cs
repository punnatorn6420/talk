using System;
using System.Globalization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using NokAir.Core.Exceptions;
using NokAir.TalkToCeo.Shared.Configurations;
using NokAir.TalkToCeo.Shared.Dtos;
using NokAir.TalkToCeo.Shared.Entities.TalkToCeo;
using NokAir.TalkToCeo.Shared.Repositories;

namespace NokAir.TalkToCeo.Shared.Services
{
    /// <summary>
    /// Implements the IMessageAttachmentService interface to manage message attachments in the TalkToCeo system.
    /// </summary>
    public class MessageAttachmentService : IMessageAttachmentService
    {
        private readonly IWebHostEnvironment env;

        private readonly TalkToCeoDbContext dbContext;

        private readonly IMessageAttachmentRepository attachmentRepository;

        private readonly IMessageRepository messageRepository;

        private readonly FileUploadOptions fileOptions;

        /// <summary>
        /// Initializes a new instance of the <see cref="MessageAttachmentService"/> class with the specified dependencies.
        /// </summary>
        /// <param name="env">The web host environment.</param>
        /// <param name="dbContext">The database context for accessing TalkToCeo data.</param>
        /// <param name="attachmentRepository">The repository for managing message attachments.</param>
        /// <param name="messageRepository">The repository for managing messages.</param>
        /// <param name="fileOptions">The file upload options for configuring allowed file types and other settings.</param>
        public MessageAttachmentService(
            IWebHostEnvironment env,
            TalkToCeoDbContext dbContext,
            IMessageAttachmentRepository attachmentRepository,
            IMessageRepository messageRepository,
            IOptions<FileUploadOptions> fileOptions)
        {
            this.env = env;
            this.dbContext = dbContext;
            this.attachmentRepository = attachmentRepository;
            this.messageRepository = messageRepository;
            this.fileOptions = fileOptions.Value;
        }

        /// <inheritdoc/>
        public async Task<List<string>> StoreFilesForMessageAsync(
              int messageId,
              IFormFileCollection files,
              UserDto userDto)
        {
            try
            {
                var message = await this.messageRepository.FindMessageByIdAsync(messageId);

                if (message == null)
                {
                    throw new DataValidationException("Message not found");
                }

                var allowedExtensions = new HashSet<string>(
                    this.fileOptions.AllowedExtensions,
                    StringComparer.OrdinalIgnoreCase);

                var folderPath =
                    Path.Combine(
                        this.env.WebRootPath,
                        this.fileOptions.BaseFolder,
                        messageId.ToString(CultureInfo.InvariantCulture));

                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }

                var attachments = new List<MessageAttachment>();

                var uploadedFiles =
                    new List<string>();

                foreach (var file in files)
                {
                    if (file.Length == 0)
                    {
                        continue;
                    }

                    var extension = Path.GetExtension(file.FileName);

                    if (!allowedExtensions.Contains(extension))
                    {
                        throw new DataValidationException(
                            $"File type not allowed: {extension}");
                    }

                    var maxFileSizeBytes =
                        this.fileOptions.MaxFileSizeMB
                        * 1024 * 1024;

                    if (file.Length > maxFileSizeBytes)
                    {
                        throw new DataValidationException(
                            $"File too large: {file.FileName}");
                    }

                    var originalFileName =
                         Path.GetFileNameWithoutExtension(file.FileName);

                    var timestamp =
                        DateTime.Now
                            .ToString("yyyy_MM_dd HH-mm-ss", CultureInfo.InvariantCulture);

                    var safeFileName =
                        $"{originalFileName}_{timestamp}{extension}";

                    var fullPath =
                        Path.Combine(folderPath, safeFileName);

                    using var stream =
                        new FileStream(fullPath, FileMode.Create);

                    await file.CopyToAsync(stream);

                    var relativePath =
                        Path.Combine(
                            this.fileOptions.BaseFolder,
                            messageId.ToString(CultureInfo.InvariantCulture),
                            safeFileName);

                    var userNameAcc = (userDto?.FirstName ?? string.Empty) + " " + (userDto?.LastName ?? string.Empty);

                    attachments.Add(
                        new MessageAttachment
                        {
                            MessageId = messageId,
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
            catch
            {
                throw;
            }
        }

        /// <inheritdoc/>
        public async Task<(string FullPath, string FileName)?> GetDownloadFileAsync(int messageId, int attachmentId)
        {
            var attachment = await this.attachmentRepository.FindAttachmentByIdAsync(messageId, attachmentId);

            if (attachment == null)
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
        public async Task RemoveAttachmentAsync(int messageId, int attachmentId)
        {
            var attachment = await this.attachmentRepository.FindAttachmentByIdAsync(messageId, attachmentId);

            if (attachment == null)
            {
                throw new DataValidationException(
                    "Attachment not found");
            }

            if (attachment.MessageId != messageId)
            {
                throw new DataValidationException(
                    "Attachment does not belong to this message");
            }

            var fullPath =
                Path.Combine(
                    this.env.WebRootPath,
                    attachment.FilePath);

            if (File.Exists(fullPath))
            {
                File.Delete(fullPath);
            }

            await this.attachmentRepository.RemoveMessageAttachmentAsync(attachment);

            await this.dbContext.SaveChangesAsync();
        }
    }
}
