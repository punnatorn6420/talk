using System;

namespace NokAir.TalkToCeo.Shared.Constants
{
    public static class TalkToCeoRole
    {
        /// <summary>
        /// Defines the role name for administrators in the TalkToCeo system.
        /// </summary> 
        public const string Admin = "Admin";

        /// <summary>
        /// Defines the role name for regular users in the TalkToCeo system.
        /// </summary>
        public const string User = "User";

        /// <summary>
        /// Defines the role name for the CEO in the TalkToCeo system.
        /// </summary>
        public const string Ceo = "Ceo";

        /// <summary>
        /// Defines a list of all system roles in the TalkToCeo system.
        /// </summary>
        public static readonly List<string> SystemRoles = new List<string> { Admin, User, Ceo };
    }
}
