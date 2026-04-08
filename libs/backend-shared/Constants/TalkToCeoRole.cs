using System;

namespace NokAir.TalkToCeo.Shared.Constants
{
    /// <summary>
    /// Defines the role names used in the "Talk to CEO" system. This class provides constant string values for each role, such as Admin, User, and Ceo, which can be used throughout the application to manage user permissions and access control. Additionally, it includes a list of all system roles for easy reference and validation when assigning roles to users or checking their permissions.
    /// </summary>
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
