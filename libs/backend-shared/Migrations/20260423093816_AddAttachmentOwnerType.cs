using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NokAir.TalkToCeo.Shared.Migrations
{
    /// <inheritdoc />
    public partial class AddAttachmentOwnerType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "file_path",
                table: "message_attachments",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(500)",
                oldMaxLength: 500);

            migrationBuilder.AddColumn<int>(
                name: "owner_type",
                table: "message_attachments",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "owner_type",
                table: "message_attachments");

            migrationBuilder.AlterColumn<string>(
                name: "file_path",
                table: "message_attachments",
                type: "character varying(500)",
                maxLength: 500,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");
        }
    }
}
