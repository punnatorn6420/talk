using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NokAir.TalkToCeo.Shared.Migrations
{
    /// <inheritdoc />
    public partial class AddPublishedAtbroadcast : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "published_at",
                table: "broadcast_messages",
                type: "timestamp without time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "published_at",
                table: "broadcast_messages");
        }
    }
}
