using Microsoft.EntityFrameworkCore;
using NokAir.TalkToCeo.Shared.Entities.Common;
using NokAir.TalkToCeo.Shared.Entities.TalkToCeo;

namespace NokAir.TalkToCeo.Shared.Repositories
{
    /// <summary>
    /// Constructor for TalkToCeoDbContext, which takes DbContextOptions as a parameter and passes it to the base DbContext class.
    /// </summary>
    /// <param name="options">The options for configuring the DbContext, such as the database provider and connection string.</param>
    public class TalkToCeoDbContext(DbContextOptions<TalkToCeoDbContext> options) : DbContext(options)
    {
        /// <summary>
        /// Gets or sets dbSet property for the User entity, which represents the users in the application. This property allows you to perform CRUD operations on the User table in the database using Entity Framework Core's LINQ queries and other data manipulation methods.
        /// </summary>
        public DbSet<User> User { get; set; }

        /// <summary>
        /// Gets or sets dbSet property for the Role entity, which represents the roles in the application. This property allows you to perform CRUD operations on the Role table in the database using Entity Framework Core's LINQ queries and other data manipulation methods.
        /// </summary>
        public DbSet<Role> Roles { get; set; }

        /// <summary>
        /// Gets or sets dbSet property for the UserRole entity, which represents the many-to-many relationship between users and roles in the application. This property allows you to perform CRUD operations on the UserRole table in the database using Entity Framework Core's LINQ queries and other data manipulation methods.
        /// </summary>
        public DbSet<UserRole> UserRole { get; set; }

        /// <summary>
        /// Gets or sets dbSet property for the Messages entity, which represents the messages in the application. This property allows you to perform CRUD operations on the Messages table in the database using Entity Framework Core's LINQ queries and other data manipulation methods.
        /// </summary>
        public DbSet<Messages> Messages { get; set; }

        /// <summary>
        /// Gets or sets dbSet property for the MessageAttachment entity, which represents the attachments associated with messages in the application. This property allows you to perform CRUD operations on the MessageAttachment table in the database using Entity Framework Core's LINQ queries and other data manipulation methods, enabling you to manage attachments related to messages effectively within the TalkToCeo system.
        /// </summary>
        public DbSet<MessageAttachment> MessageAttachments { get; set; }

        /// <summary>
        /// Overrides the OnModelCreating method to configure the entity mappings and relationships for the TalkToCeoDbContext. This method is called by Entity Framework Core when the model is being created, and it allows you to specify how the entities should be mapped to the database tables, as well as any relationships between them. In this implementation, we configure the data types for DateTime properties, and we define the mappings for the User, Role, UserRole, and Messages entities using Fluent API.
        /// </summary>
        /// <param name="modelBuilder">The model builder used to configure the entity mappings and relationships.</param>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // กำหนดค่า data types สำหรับ DateTime ให้เป็น timestamp with time zone
            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                foreach (var property in entityType.GetProperties())
                {
                    if (property.ClrType == typeof(DateTime) || property.ClrType == typeof(DateTime?))
                    {
                        property.SetColumnType("timestamp without time zone");
                    }
                }
            }

            ConfigureUser(modelBuilder);

            ConfigureRole(modelBuilder);

            ConfigureUserRole(modelBuilder);

            ConfigureMessage(modelBuilder);

            ConfigureMessageAttachment(modelBuilder);
        }

        private static void ConfigureMessageAttachment(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<MessageAttachment>(entity =>
            {
                entity.ToTable("message_attachments");

                entity.HasKey(a => a.Id);

                entity.Property(a => a.Id)
                    .HasColumnName("id");

                entity.Property(a => a.MessageId)
                    .HasColumnName("message_id")
                    .IsRequired();

                entity.Property(a => a.FilePath)
                    .HasColumnName("file_path")
                    .IsRequired()
                    .HasMaxLength(500);

                entity.Property(a => a.CreatedAt)
                    .HasColumnName("created_at")
                    .IsRequired();

                entity.Property(a => a.ModifiedAt)
                    .HasColumnName("modified_at")
                    .IsRequired();

                entity.Property(a => a.CreatedBy)
                    .HasColumnName("created_by");

                entity.Property(a => a.ModifiedBy)
                    .HasColumnName("modified_by");

                entity.HasOne(a => a.Message)
                    .WithMany(m => m.Attachments)
                    .HasForeignKey(a => a.MessageId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }

        private static void ConfigureUser(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users");

                entity.HasKey(u => u.Id);

                entity.Property(u => u.Id).HasColumnName("id").ValueGeneratedNever();
                entity.Property(u => u.ObjectId).HasColumnName("object_id").IsRequired().HasMaxLength(50);
                entity.Property(u => u.FirstName).HasColumnName("first_name").IsRequired().HasMaxLength(50);
                entity.Property(u => u.LastName).HasColumnName("last_name").IsRequired().HasMaxLength(50);
                entity.Property(u => u.Email).HasColumnName("email").IsRequired().HasMaxLength(100);
                entity.Property(u => u.JobTitle).HasColumnName("job_title").IsRequired().HasMaxLength(50);
                entity.Property(u => u.Department).HasColumnName("department").IsRequired().HasMaxLength(50);
                entity.Property(u => u.Active).HasColumnName("active").IsRequired();
                entity.Property(u => u.CreatedAt).HasColumnName("created_at").IsRequired();
                entity.Property(u => u.ModifiedAt).HasColumnName("modified_at").IsRequired();
            });
        }

        private static void ConfigureRole(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Role>(entity =>
            {
                entity.ToTable("roles");

                entity.HasKey(r => r.Id);

                entity.Property(r => r.Id).HasColumnName("id");
                entity.Property(r => r.Name).HasColumnName("name").IsRequired().HasMaxLength(100);
                entity.Property(t => t.CreatedAt).HasColumnName("created_at").IsRequired();
                entity.Property(a => a.ModifiedAt).HasColumnName("modified_at").IsRequired();
            });
        }

        private static void ConfigureUserRole(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserRole>(entity =>
            {
                entity.ToTable("user_roles");

                entity.HasKey(e => new { e.UserId, e.RoleId });

                entity.Property(e => e.UserId).HasColumnName("user_id").ValueGeneratedNever();
                entity.Property(e => e.RoleId).HasColumnName("role_id").ValueGeneratedNever();
            });
        }

        private static void ConfigureMessage(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Messages>(entity =>
            {
                entity.ToTable("messages");

                entity.HasKey(m => m.Id);

                entity.Property(m => m.Id)
                    .HasColumnName("id")
                    .ValueGeneratedOnAdd();

                entity.Property(m => m.PostedAt)
                    .HasColumnName("posted_at")
                    .IsRequired();

                entity.Property(m => m.Subject)
                    .HasColumnName("subject")
                    .IsRequired();

                entity.Property(m => m.Detail)
                    .HasColumnName("detail")
                    .IsRequired();

                entity.Property(m => m.CeoReply)
                    .HasColumnName("ceo_reply");

                entity.Property(m => m.UserId)
                    .HasColumnName("user_id")
                    .IsRequired();

                entity.Property(m => m.CeoId)
                    .HasColumnName("ceo_id");

                entity.Property(m => m.Status)
                    .HasColumnName("status")
                    .HasConversion<int>() // enum → int
                    .IsRequired();

                entity.Property(m => m.ReadAt)
                    .HasColumnName("read_at");

                entity.Property(m => m.RepliedAt)
                    .HasColumnName("replied_at");

                /*
                 * FK: Message → Sender (User)
                 */

                entity.HasOne(m => m.User)
                    .WithMany()
                    .HasForeignKey(m => m.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                /*
                 * FK: Message → CEO (User)
                 */

                entity.HasOne(m => m.Ceo)
                    .WithMany()
                    .HasForeignKey(m => m.CeoId)
                    .OnDelete(DeleteBehavior.Restrict);

                /*
                 * AuditBase mapping
                 */

                entity.Property(m => m.CreatedAt)
                    .HasColumnName("created_at")
                    .IsRequired();

                entity.Property(m => m.ModifiedAt)
                    .HasColumnName("modified_at")
                    .IsRequired();

                entity.Property(m => m.CreatedBy)
                    .HasColumnName("created_by");

                entity.Property(m => m.ModifiedBy)
                    .HasColumnName("modified_by");
            });
        }
    }
}
