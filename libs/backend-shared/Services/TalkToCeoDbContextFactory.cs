using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using NokAir.TalkToCeo.Shared.Repositories;

namespace NokAir.TalkToCeo.Shared.Services
{
    /// <summary>
    /// Represents a factory for creating instances of the TalkToCeoDbContext at design time. This class implements the IDesignTimeDbContextFactory interface, which allows it to be used by Entity Framework Core tools to create a DbContext instance when running commands such as migrations or updating the database. The factory reads the database connection string from an environment variable and configures the DbContext options accordingly, ensuring that the correct database connection is used during design-time operations. This setup is essential for maintaining a consistent development workflow and enabling seamless integration with Entity Framework Core's tooling features.
    /// </summary>
    public class TalkToCeoDbContextFactory : IDesignTimeDbContextFactory<TalkToCeoDbContext>
    {
        /// <summary>
        /// Creates a new instance of TalkToCeoDbContext.
        /// </summary>
        /// <param name="args">arguments.</param>
        /// <returns>returns TalkToCeoDbContext.</returns>
        public TalkToCeoDbContext CreateDbContext(string[] args)
        {
            // Read connection string from environment variable
            var connectionString = Environment.GetEnvironmentVariable("TalkToCeo_DB_CONNECTION")
                ?? throw new InvalidOperationException("TalkToCeo_DB_CONNECTION environment variable is not set");

            var optionsBuilder = new DbContextOptionsBuilder<TalkToCeoDbContext>();
            optionsBuilder.UseNpgsql(connectionString);

            return new TalkToCeoDbContext(optionsBuilder.Options);
        }
    }
}
