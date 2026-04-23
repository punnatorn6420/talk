using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace NokAir.TalkToCeo.Shared.Migrations
{
    /// <inheritdoc />
    public partial class AddidBroadcastAttachment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "broadcast_message_attachments",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    broadcast_message_id = table.Column<int>(type: "integer", nullable: false),
                    file_path = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    created_by = table.Column<string>(type: "text", nullable: false),
                    modified_by = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    modified_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_broadcast_message_attachments", x => x.id);
                    table.ForeignKey(
                        name: "FK_broadcast_message_attachments_broadcast_messages_broadcast_~",
                        column: x => x.broadcast_message_id,
                        principalTable: "broadcast_messages",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_broadcast_message_attachments_broadcast_message_id",
                table: "broadcast_message_attachments",
                column: "broadcast_message_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "broadcast_message_attachments");
        }
    }
}
