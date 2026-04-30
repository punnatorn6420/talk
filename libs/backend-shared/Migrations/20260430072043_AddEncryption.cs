using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NokAir.TalkToCeo.Shared.Migrations
{
    /// <inheritdoc />
    public partial class AddEncryption : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ceo_reply_nonce",
                table: "messages",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ceo_reply_tag",
                table: "messages",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "detail_nonce",
                table: "messages",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "detail_tag",
                table: "messages",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "shot_detail",
                table: "messages",
                type: "text",
                nullable: false,
                defaultValue: string.Empty);

            migrationBuilder.AddColumn<string>(
                name: "DetailNonce",
                table: "broadcast_messages",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DetailTag",
                table: "broadcast_messages",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ShotDetail",
                table: "broadcast_messages",
                type: "text",
                nullable: false,
                defaultValue: string.Empty);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ceo_reply_nonce",
                table: "messages");

            migrationBuilder.DropColumn(
                name: "ceo_reply_tag",
                table: "messages");

            migrationBuilder.DropColumn(
                name: "detail_nonce",
                table: "messages");

            migrationBuilder.DropColumn(
                name: "detail_tag",
                table: "messages");

            migrationBuilder.DropColumn(
                name: "shot_detail",
                table: "messages");

            migrationBuilder.DropColumn(
                name: "DetailNonce",
                table: "broadcast_messages");

            migrationBuilder.DropColumn(
                name: "DetailTag",
                table: "broadcast_messages");

            migrationBuilder.DropColumn(
                name: "ShotDetail",
                table: "broadcast_messages");
        }
    }
}
