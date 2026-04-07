using Microsoft.EntityFrameworkCore;
using NokAir.TalkToCeo.Shared.Entities.Common;
using NokAir.TalkToCeo.Shared.Entities.TalkToCeo;

namespace NokAir.TalkToCeo.Shared.Repositories
{
    /// <summary>
    /// Constructor for TalkToCeoDbContext, which takes DbContextOptions as a parameter and passes it to the base DbContext class.
    /// </summary>
    public class TalkToCeoDbContext(DbContextOptions<TalkToCeoDbContext> options) : DbContext(options)
    {

        public DbSet<User> User { get; set; }

        public DbSet<Role> Roles { get; set; }

        public DbSet<UserRole> UserRole { get; set; }

        public DbSet<Messages> Messages { get; set; }


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
