using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using NokAir.TalkToCeo.Shared.Repositories;

namespace NokAir.TalkToCeo.Shared.Services
{
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
