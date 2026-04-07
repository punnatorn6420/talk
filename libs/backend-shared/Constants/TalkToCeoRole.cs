using System;

namespace NokAir.TalkToCeo.Shared.Constants
{
    public static class TalkToCeoRole
    {
        public const string Admin = "Admin";

        public const string User = "User";

        public const string Ceo = "Ceo";

        public static readonly List<string> SystemRoles = new List<string> { Admin, User, Ceo };
    }
}
