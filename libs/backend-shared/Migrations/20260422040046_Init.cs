using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace NokAir.TalkToCeo.Shared.Migrations
{
    /// <inheritdoc />
    public partial class Init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "roles",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Active = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    modified_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_roles", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false),
                    object_id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    first_name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    last_name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    email = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    job_title = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    department = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    active = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    modified_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "broadcast_messages",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    subject = table.Column<string>(type: "text", nullable: false),
                    detail = table.Column<string>(type: "text", nullable: false),
                    ceo_id = table.Column<int>(type: "integer", nullable: false),
                    status = table.Column<int>(type: "integer", nullable: false),
                    start_display_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    expire_display_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    created_by = table.Column<string>(type: "text", nullable: false),
                    modified_by = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    modified_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_broadcast_messages", x => x.id);
                    table.ForeignKey(
                        name: "FK_broadcast_messages_users_ceo_id",
                        column: x => x.ceo_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "messages",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    posted_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    subject = table.Column<string>(type: "text", nullable: false),
                    detail = table.Column<string>(type: "text", nullable: false),
                    ceo_reply = table.Column<string>(type: "text", nullable: true),
                    ceo_id = table.Column<int>(type: "integer", nullable: true),
                    user_id = table.Column<int>(type: "integer", nullable: false),
                    status = table.Column<int>(type: "integer", nullable: false),
                    read_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    replied_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    created_by = table.Column<string>(type: "text", nullable: false),
                    modified_by = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    modified_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_messages", x => x.id);
                    table.ForeignKey(
                        name: "FK_messages_users_ceo_id",
                        column: x => x.ceo_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_messages_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "user_roles",
                columns: table => new
                {
                    user_id = table.Column<int>(type: "integer", nullable: false),
                    role_id = table.Column<int>(type: "integer", nullable: false),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_roles", x => new { x.user_id, x.role_id });
                    table.ForeignKey(
                        name: "FK_user_roles_roles_role_id",
                        column: x => x.role_id,
                        principalTable: "roles",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_user_roles_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "broadcast_message_reads",
                columns: table => new
                {
                    broadcast_message_id = table.Column<int>(type: "integer", nullable: false),
                    user_id = table.Column<int>(type: "integer", nullable: false),
                    read_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_broadcast_message_reads", x => new { x.broadcast_message_id, x.user_id });
                    table.ForeignKey(
                        name: "FK_broadcast_message_reads_broadcast_messages_broadcast_messag~",
                        column: x => x.broadcast_message_id,
                        principalTable: "broadcast_messages",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_broadcast_message_reads_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "message_attachments",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    message_id = table.Column<int>(type: "integer", nullable: false),
                    file_path = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    created_by = table.Column<string>(type: "text", nullable: false),
                    modified_by = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    modified_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_message_attachments", x => x.id);
                    table.ForeignKey(
                        name: "FK_message_attachments_messages_message_id",
                        column: x => x.message_id,
                        principalTable: "messages",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_broadcast_message_reads_user_id",
                table: "broadcast_message_reads",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_broadcast_messages_ceo_id",
                table: "broadcast_messages",
                column: "ceo_id");

            migrationBuilder.CreateIndex(
                name: "IX_message_attachments_message_id",
                table: "message_attachments",
                column: "message_id");

            migrationBuilder.CreateIndex(
                name: "IX_messages_ceo_id",
                table: "messages",
                column: "ceo_id");

            migrationBuilder.CreateIndex(
                name: "IX_messages_user_id",
                table: "messages",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_user_roles_role_id",
                table: "user_roles",
                column: "role_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "broadcast_message_reads");

            migrationBuilder.DropTable(
                name: "message_attachments");

            migrationBuilder.DropTable(
                name: "user_roles");

            migrationBuilder.DropTable(
                name: "broadcast_messages");

            migrationBuilder.DropTable(
                name: "messages");

            migrationBuilder.DropTable(
                name: "roles");

            migrationBuilder.DropTable(
                name: "users");
        }
    }
}
