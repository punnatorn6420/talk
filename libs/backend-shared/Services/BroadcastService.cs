using System;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Hosting;
using NokAir.Core.Domain.Entities.InHouse;
using NokAir.Core.Exceptions;
using NokAir.TalkToCeo.Shared.Dtos;
using NokAir.TalkToCeo.Shared.Entities.TalkToCeo;
using NokAir.TalkToCeo.Shared.Enums;
using NokAir.TalkToCeo.Shared.Repositories;

namespace NokAir.TalkToCeo.Shared.Services
{
    /// <summary>
    /// Implements the broadcast service for the TalkToCeo application. This service is responsible for managing broadcast messages, including creating new broadcasts. The BroadcastService class implements the IBroadcastService interface, providing the actual business logic for handling broadcast messages. The CreateBroadcastAsync method validates the input data, ensures that required fields are present, and creates a new broadcast message in the repository. This implementation allows for separation of concerns and easier maintenance of the codebase.
    /// </summary>
    public partial class BroadcastService : IBroadcastService
    {
        private readonly IBroadcastRepository broadcastRepository;
        private readonly IUsersRepository<UserDto> usersRepository;
        private readonly IMessageAttachmentRepository attachmentRepository;
        private readonly IBroadcastAttachmentRepository broadcastAttachmentRepository;
        private readonly IBroadcastAttachmentService broadcastAttachmentService;
        private readonly TalkToCeoDbContext talkToCeoDbContext;
        private readonly AesGcmService aesGcm;
        private readonly IWebHostEnvironment env;

        /// <summary>
        /// Initializes a new instance of the <see cref="BroadcastService"/> class with the specified broadcast repository. The constructor takes an <see cref="IBroadcastRepository"/> as a parameter, which is used to interact with the underlying data store for managing broadcast messages. This allows the service to perform operations such as creating new broadcast messages and retrieving existing ones. By injecting the repository through the constructor, we can easily manage dependencies and promote better testability of the service class.
        /// </summary>
        /// <param name="broadcastRepository">The broadcast repository used to interact with the underlying data store.</param>
        /// <param name="usersRepository">The users repository used to interact with the underlying data store for user-related operations.</param>
        /// <param name="attachmentRepository">The attachment repository used to interact with the underlying data store for attachment-related operations.</param>
        /// <param name="broadcastAttachmentRepository">The broadcast attachment repository used to interact with the underlying data store for broadcast attachment-related operations.</param>
        /// <param name="broadcastAttachmentService">The broadcast attachment service used to manage broadcast attachment-related operations.</param>
        /// <param name="talkToCeoDbContext">The database context used to manage transactions and interact with the underlying data store.</param>
        /// <param name="aesGcm">The AES-GCM service used for encryption and decryption of broadcast details.</param>
        /// <param name="env">The web host environment used to access environment-specific information such as the web root path.</param>
        public BroadcastService(
              IBroadcastRepository broadcastRepository,
              IUsersRepository<UserDto> usersRepository,
              IMessageAttachmentRepository attachmentRepository,
              IBroadcastAttachmentRepository broadcastAttachmentRepository,
              IBroadcastAttachmentService broadcastAttachmentService,
              TalkToCeoDbContext talkToCeoDbContext,
              AesGcmService aesGcm,
              IWebHostEnvironment env)
        {
            this.broadcastRepository = broadcastRepository;
            this.usersRepository = usersRepository;
            this.attachmentRepository = attachmentRepository;
            this.broadcastAttachmentRepository = broadcastAttachmentRepository;
            this.broadcastAttachmentService = broadcastAttachmentService;
            this.talkToCeoDbContext = talkToCeoDbContext;
            this.broadcastAttachmentService = broadcastAttachmentService;
            this.aesGcm = aesGcm;
            this.env = env;
        }

        /// <inheritdoc/>
        public async Task CreateBroadcastAsync(CreateBroadcastRequestDto dto, int ceoId, UserDto user)
        {
            using var transaction = await this.talkToCeoDbContext.Database.BeginTransactionAsync();
            try
            {
                if (string.IsNullOrWhiteSpace(dto.Subject))
                {
                    throw new DataValidationException("Subject is required.");
                }

                if (string.IsNullOrWhiteSpace(dto.Detail))
                {
                    throw new DataValidationException("Detail is required.");
                }

                var now = DateTime.Now;

                var startDisplayAt = dto.StartDisplayAt;

                var expireDisplayAt =
                    dto.ExpireDisplayAt ?? startDisplayAt.AddMonths(3);

                if (expireDisplayAt < startDisplayAt)
                {
                    throw new DataValidationException(
                        "ExpireDisplayAt must be greater than StartDisplayAt.");
                }

                var userNameAcc =
                    (user?.FirstName ?? string.Empty) + " " + (user?.LastName ?? string.Empty);

                DateTime? publishAt = null;

                if (dto.Status == BroadcastStatus.Sent)
                {
                    publishAt = now;
                }

                var entity = new BroadcastMessages
                {
                    Subject = dto.Subject.Trim(),
                    ShotDetail = TrimToFirstWords(dto.Detail, 10),
                    CeoId = ceoId,
                    Status = dto.Status,
                    StartDisplayAt = startDisplayAt,
                    ExpireDisplayAt = expireDisplayAt,
                    PublishedAt = publishAt,
                    ModifiedAt = now,
                    CreatedAt = now,
                    ModifiedBy = userNameAcc,
                    CreatedBy = userNameAcc,
                };

                if (dto.Status == BroadcastStatus.Sent)
                {
                    // 🔐 Encrypt Detail
                    var enc = this.aesGcm.Encrypt(dto.Detail);
                    entity.Detail = enc.Cipher;
                    entity.DetailNonce = enc.Nonce;
                    entity.DetailTag = enc.Tag;
                    entity.Status = dto.Status;
                }
                else
                {
                    entity.Status = dto.Status;
                    entity.Detail = dto.Detail;
                }

                var createdEntity = await this.broadcastRepository.AddBroadcastMessageAsync(entity);

                if (dto.Attachments != null && dto.Attachments.Count > 0)
                {
                    if (user == null)
                    {
                        throw new DataValidationException("User information is required.");
                    }

                    await this.broadcastAttachmentService.StoreFilesForBroadcastAsync(createdEntity.Id, dto.Attachments, user);
                }

                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        /// <inheritdoc/>
        public async Task DeleteBroadcastAsync(int broadcastId, int ceoId)
        {
            var entity = await this.broadcastRepository.FindBroadcastMessageForDeleteByIdAsync(broadcastId);

            if (entity == null)
            {
                throw new DataValidationException("Broadcast not found.");
            }

            if (entity.CeoId != ceoId)
            {
                throw new DataValidationException("You do not have permission to delete this broadcast.");
            }

            // ✅ ใช้ method ที่คุณมีอยู่แล้ว
            var attachments = await this.broadcastAttachmentRepository
                .FindAttachmentsByBroadcastIdAsync(broadcastId);

            // ✅ ลบไฟล์จริง
            foreach (var attachment in attachments)
            {
                try
                {
                    var fullPath = Path.Combine(this.env.WebRootPath, attachment.FilePath);

                    if (File.Exists(fullPath))
                    {
                        File.Delete(fullPath);
                    }
                }
                catch (Exception)
                {
                    // log ไว้ แต่ไม่ throw เพื่อไม่ให้ลบ broadcast fail
                }
            }

            // ✅ ลบ DB (cascade จะลบ attachments ให้)
            await this.broadcastRepository.RemoveBroadcastMessageAsync(entity);
        }

        /// <inheritdoc/>
        public async Task<BroadcastResponseDto?> GetBroadcastByIdAsync(int id, int userId)
        {
            var broadcast = await this.broadcastRepository.FindBroadcastByIdAsync(id);

            if (broadcast == null)
            {
                throw new DataValidationException("Broadcast not found.");
            }

            var attachments = await this.broadcastAttachmentRepository.FindAttachmentsByBroadcastIdAsync(id);

            var isRead = broadcast.Reads.Any(x => x.UserId == userId);

            string detail = string.Empty;

            if (broadcast.Status == BroadcastStatus.Draft)
            {
                detail = broadcast.Detail ?? string.Empty;
            }
            else
            {
                detail = this.aesGcm.Decrypt(broadcast.Detail ?? string.Empty, broadcast.DetailNonce ?? string.Empty, broadcast.DetailTag ?? string.Empty);
            }

            return new BroadcastResponseDto
            {
                Id = broadcast.Id,
                Subject = broadcast.Subject,
                Detail = detail,
                CreatedAt = broadcast.CreatedAt,
                CreatedBy = broadcast.CreatedBy,
                ModifiedAt = broadcast.ModifiedAt,
                ModifiedBy = broadcast.ModifiedBy,
                StartDisplayDate = broadcast.StartDisplayAt,
                ExpireDisplayDate = broadcast.ExpireDisplayAt,
                Attachments = attachments.Select(x =>
                        new MessageAttachmentDto
                        {
                            Id = x.Id,
                            FileName = Path.GetFileName(x.FilePath),
                        })
                    .ToList(),
                IsRead = isRead,
            };
        }

        /// <inheritdoc/>
        public async Task<List<BroadcastReaderResponseDto>> GetBroadcastReadersAsync(int broadcastId, int ceoId)
        {
            var broadcast = await this.broadcastRepository.FindBroadcastMessageByIdAsync(broadcastId);

            if (broadcast == null)
            {
                throw new DataValidationException("Broadcast not found.");
            }

            if (broadcast.CeoId != ceoId)
            {
                throw new DataValidationException(
                    "You do not have permission to view readers of this broadcast.");
            }

            var readers = await this.broadcastRepository.FindBroadcastReadMessagesAsync(broadcastId);

            return readers.Select(x => new BroadcastReaderResponseDto
            {
                UserId = x.UserId,
                FirstName = x.User.FirstName,
                LastName = x.User.LastName,
                Email = x.User.Email,
                Department = x.User.Department,
                JobTitle = x.User.JobTitle,
                ReadAt = x.ReadAt,
            }).ToList();
        }

        /// <inheritdoc/>
        public async Task<BroadcastReadSummaryResponseDto> GetBroadcastReadSummaryAsync(int broadcastId, int ceoId)
        {
            var broadcast = await this.broadcastRepository.FindBroadcastMessageByIdAsync(broadcastId);

            if (broadcast == null)
            {
                throw new DataValidationException("Broadcast not found.");
            }

            if (broadcast.CeoId != ceoId)
            {
                throw new DataValidationException(
                    "You do not have permission to view this broadcast summary.");
            }

            if (broadcast.Status != BroadcastStatus.Sent)
            {
                throw new DataValidationException(
                    "Summary available only after broadcast is sent.");
            }

            var totalUsers = await this.usersRepository.FindUserCountAsync();

            var readers = await this.broadcastRepository
                .FindCountReadersAsync(broadcastId);

            var unread = totalUsers - readers;

            var percentage =
                totalUsers == 0
                    ? 0
                    : Math.Round((double)readers / totalUsers * 100, 2);

            var lastReadAt = await this.broadcastRepository
                .FindGetLastReadAtAsync(broadcastId);

            return new BroadcastReadSummaryResponseDto
            {
                BroadcastId = broadcastId,
                TotalUsers = totalUsers,
                ReadCount = readers,
                UnreadCount = unread,
                ReadPercentage = percentage,
                LastReadAt = lastReadAt,
            };
        }

        /// <inheritdoc/>
        public async Task<BroadcastResponseListDto> GetBroadcastsAsync(
            string keyword,
            string sortField,
            int pageNumber,
            int pageSize,
            bool ascending,
            DateTimeOffset? searchStartDate,
            DateTimeOffset? searchEndDate,
            int ceoId)
        {
            var pagedResult = await this.broadcastRepository
                .FindBroadcastsAsync(
                    keyword,
                    sortField,
                    pageNumber,
                    pageSize,
                    ascending,
                    searchStartDate,
                    searchEndDate,
                    ceoId);

            var broadcastIds = pagedResult.Items.Select(x => x.Id).ToList();

            var attachments = await this.broadcastAttachmentRepository.FindAttachmentsByBroadcastIdsAsync(broadcastIds);

            var attachmentLookup =
                attachments
                    .GroupBy(x => x.BroadcastMessageId)
                    .ToDictionary(g => g.Key, g => g.ToList());

            return new BroadcastResponseListDto
            {
                TotalCount = pagedResult.TotalCount,
                Items = pagedResult.Items.Select(x => new BroadcastResponseDto
                {
                    Id = x.Id,
                    Subject = x.Subject,
                    Detail = x.ShotDetail,
                    Status = x.Status,
                    StartDisplayDate = x.StartDisplayAt,
                    ExpireDisplayDate = x.ExpireDisplayAt,
                    CreatedAt = x.CreatedAt,
                    CreatedBy = x.User.FirstName + " " + x.User.LastName,
                    ModifiedAt = x.ModifiedAt,
                    ModifiedBy = x.ModifiedBy,
                    Attachments =
                        attachmentLookup.TryGetValue(x.Id, out List<BroadcastMessageAttachment>? value)
                            ? value.Select(a =>
                                    new MessageAttachmentDto
                                    {
                                        Id = a.Id,
                                        FileName =
                                            Path.GetFileName(
                                                a.FilePath),
                                    })
                                .ToList()
                            : new List<MessageAttachmentDto>(),
                }).ToList(),
            };
        }

        /// <inheritdoc/>
        public async Task<List<BroadcastResponseDto>> GetMyBroadcastsAsync(int userId)
        {
            var broadcasts = await this.broadcastRepository
                .FindVisibleBroadcastsAsync(userId);

            var broadcastIds = broadcasts.Select(x => x.Id).ToList();

            var attachments = await this.broadcastAttachmentRepository
                .FindAttachmentsByBroadcastIdsAsync(broadcastIds);

            var attachmentLookup = attachments
                .GroupBy(x => x.BroadcastMessageId)
                .ToDictionary(g => g.Key, g => g.ToList());

            return broadcasts.Select(x =>
            {
                string detail;

                if (x.Status == BroadcastStatus.Draft)
                {
                    detail = x.Detail ?? string.Empty;
                }
                else
                {
                    detail = this.aesGcm.Decrypt(
                        x.Detail ?? string.Empty,
                        x.DetailNonce ?? string.Empty,
                        x.DetailTag ?? string.Empty);
                }

                return new BroadcastResponseDto
                {
                    Id = x.Id,
                    Subject = x.Subject,
                    Detail = detail,
                    Status = x.Status,
                    StartDisplayDate = x.StartDisplayAt,
                    ExpireDisplayDate = x.ExpireDisplayAt,
                    CreatedAt = x.CreatedAt,
                    CreatedBy = x.Ceo.FirstName + " " + x.Ceo.LastName,
                    IsRead = x.ReadAt != null,
                    ModifiedAt = x.ModifiedAt,
                    ModifiedBy = x.ModifiedBy,
                    Attachments =
                        attachmentLookup.TryGetValue(x.Id, out var value)
                            ? value.Select(a => new MessageAttachmentDto
                            {
                                Id = a.Id,
                                FileName = Path.GetFileName(a.FilePath),
                            }).ToList()
                            : new List<MessageAttachmentDto>(),
                };
            }).ToList();
        }

        /// <inheritdoc/>
        public async Task UpdateBroadcastAsync(int broadcastId, UpdateBroadcastRequestDto dto, int ceoId, UserDto user)
        {
            using var transaction = await this.talkToCeoDbContext.Database.BeginTransactionAsync();
            try
            {
                var broadcast = await this.broadcastRepository.FindBroadcastForUpdateAsync(broadcastId);

                if (broadcast == null)
                {
                    throw new DataValidationException("Broadcast not found.");
                }

                if (broadcast.CeoId != ceoId)
                {
                    throw new DataValidationException(
                        "You do not have permission to update this broadcast.");
                }

                // ถ้า publish แล้ว → ห้ามแก้ทั้งหมด
                if (broadcast.Status == BroadcastStatus.Sent)
                {
                    throw new DataValidationException(
                        "Published broadcast cannot be modified.");
                }

                // validate timeline
                if (dto.ExpireDisplayAt.HasValue &&
                    dto.ExpireDisplayAt <= dto.StartDisplayAt)
                {
                    throw new DataValidationException(
                        "ExpireDisplayAt must be greater than StartDisplayAt.");
                }

                DateTime? publishAt = null;

                if (dto.Status == BroadcastStatus.Sent)
                {
                    publishAt = DateTime.Now;
                }

                // Draft → update ได้ทั้งหมด
                broadcast.Subject = dto.Subject;
                broadcast.Detail = dto.Detail;
                broadcast.StartDisplayAt = dto.StartDisplayAt;
                broadcast.ExpireDisplayAt = dto.ExpireDisplayAt;

                if (dto.Status == BroadcastStatus.Sent)
                {
                    // 🔐 Encrypt Detail
                    var enc = this.aesGcm.Encrypt(dto.Detail);
                    broadcast.Detail = enc.Cipher;
                    broadcast.DetailNonce = enc.Nonce;
                    broadcast.DetailTag = enc.Tag;
                    broadcast.Status = BroadcastStatus.Sent;
                }
                else
                {
                    broadcast.Status = BroadcastStatus.Draft;
                    broadcast.Detail = dto.Detail;
                }

                broadcast.ModifiedAt = DateTime.Now;
                broadcast.PublishedAt = publishAt;

                await this.broadcastRepository.UpdateAsync(broadcast);

                if (dto.Attachments != null &&
                    dto.Attachments.Count > 0)
                {
                    await this.broadcastAttachmentService
                        .StoreFilesForBroadcastAsync(
                            broadcastId,
                            dto.Attachments,
                            user);
                }

                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        /// <inheritdoc/>
        public async Task UpdateReadBroadcastAsync(int broadcastId, int userId)
        {
            using var transaction = await this.talkToCeoDbContext.Database.BeginTransactionAsync();
            try
            {
                var broadcast = await this.broadcastRepository
                                .FindBroadcastMessageByIdAsync(broadcastId);

                if (broadcast == null)
                {
                    throw new DataValidationException("Broadcast not found.");
                }

                if (broadcast.Status != BroadcastStatus.Sent)
                {
                    throw new DataValidationException("Broadcast is not available.");
                }

                var now = DateTime.Now;

                if (broadcast.StartDisplayAt > now)
                {
                    throw new DataValidationException("Broadcast not started yet.");
                }

                if (broadcast.ExpireDisplayAt.HasValue &&
                    broadcast.ExpireDisplayAt < now)
                {
                    throw new DataValidationException("Broadcast expired.");
                }

                var alreadyRead = await this.broadcastRepository
                    .FindCheckUserReadStatusAsync(broadcastId, userId);

                if (alreadyRead)
                {
                    return; // already recorded → skip silently
                }

                await this.broadcastRepository.AddBroadcastReadEntryAsync(
                    broadcastId,
                    userId,
                    now);
                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        /// <inheritdoc/>
        public async Task UpdateSentBroadcastAsync(int broadcastId, string userName)
        {
            var entity = await this.broadcastRepository.FindBroadcastForUpdateAsync(broadcastId);

            if (entity == null)
            {
                throw new DataValidationException("Message not found");
            }

            // 🔐 Encrypt Detail
            if (!string.IsNullOrEmpty(entity.Detail))
            {
                var enc = this.aesGcm.Encrypt(entity.Detail);
                entity.Detail = enc.Cipher;
                entity.DetailNonce = enc.Nonce;
                entity.DetailTag = enc.Tag;
            }

            entity.Status = BroadcastStatus.Sent;
            entity.PublishedAt = DateTime.Now;
            entity.ModifiedAt = DateTime.Now;
            entity.ModifiedBy = userName;

            await this.broadcastRepository.UpdateAsync(entity);
        }

        private static string TrimToFirstWords(string? input, int wordLimit)
        {
            if (string.IsNullOrWhiteSpace(input))
            {
                return string.Empty;
            }

            // remove html tags
            var noHtml = MyRegex().Replace(input, string.Empty);

            // split words
            var words =
                noHtml
                    .Split(
                        ' ',
                        StringSplitOptions.RemoveEmptyEntries);

            if (words.Length <= wordLimit)
            {
                return noHtml;
            }

            return string.Join(" ", words.Take(wordLimit)) + "...";
        }

        [GeneratedRegex("<.*?>")]
        private static partial Regex MyRegex();
    }
}
