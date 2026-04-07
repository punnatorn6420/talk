using NokAir.Core.Abstractions.Entities.Rbac;

namespace NokAir.TalkToCeo.Shared.Entities.Common
{
        /// <summary>
        /// Represents the association between a user and a role in the RBAC system.
        /// </summary>
        public class UserRole : IUserRole
        {
                /// <summary>
                /// Gets or sets the user ID.
                /// </summary>
                public int UserId { get; set; }

                /// <summary>
                /// Gets or sets the role ID.
                /// </summary>
                public int RoleId { get; set; }

                /// <summary>
                /// Gets or sets the user. This is a navigation property.
                /// </summary>
#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider adding the 'required' modifier or declaring as nullable.
                public User User { get; set; }
#pragma warning restore CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider adding the 'required' modifier or declaring as nullable.

                /// <summary>
                /// Gets or sets role. This is a navigation property.
                /// </summary>
#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider adding the 'required' modifier or declaring as nullable.
                public Role Role { get; set; }
#pragma warning restore CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider adding the 'required' modifier or declaring as nullable.
        }
}
