using System;

namespace NokAir.TalkToCeo.Shared.Configurations
{
    /// <summary>
    /// Configuration settings for encryption, including the AES-GCM key used for encrypting message details.
    /// </summary>
    public class EncryptionSettings
    {
        /// <summary>
        /// Gets or sets 32-byte (256-bit) key for AES-GCM encryption. Must be kept secret and secure.
        /// </summary>
        public string Key { get; set; } = string.Empty;
    }
}
