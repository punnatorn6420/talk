using System.Security.Cryptography;
using System.Text;

namespace NokAir.TalkToCeo.Shared.Services
{
    /// <summary>
    /// Service for AES-GCM encryption and decryption. This service provides methods to encrypt and decrypt strings using the AES-GCM algorithm, which is a widely used symmetric encryption method that offers both confidentiality and integrity. The service takes a base64-encoded key as input during initialization and uses it for all encryption and decryption operations. The Encrypt method returns the encrypted cipher text along with the nonce and authentication tag, while the Decrypt method takes these components to retrieve the original plain text. This implementation ensures that sensitive data can be securely stored and transmitted within the application.
    /// </summary>
    public class AesGcmService : IAesGcmService
    {
        private readonly byte[] key;

        /// <summary>
        /// Initializes a new instance of the <see cref="AesGcmService"/> class with the specified base64-encoded key. The constructor takes a base64 string as input, decodes it to obtain the byte array representation of the key, and assigns it to a private readonly field. This key is then used for all encryption and decryption operations performed by the service. By accepting the key in a base64 format, the service allows for easy configuration and management of encryption keys, ensuring that sensitive data can be securely handled within the application.
        /// </summary>
        /// <param name="base64Key">The base64-encoded key used for AES-GCM encryption and decryption.</param>
        public AesGcmService(string base64Key)
        {
            this.key = Convert.FromBase64String(base64Key);
        }

        /// <inheritdoc/>
        public (string Cipher, string Nonce, string Tag) Encrypt(string plainText)
        {
            if (string.IsNullOrEmpty(plainText))
            {
                return (plainText, string.Empty, string.Empty);
            }

            var plaintextBytes = Encoding.UTF8.GetBytes(plainText);

            var nonce = RandomNumberGenerator.GetBytes(12);
            var cipher = new byte[plaintextBytes.Length];
            var tag = new byte[16];

            using var aes = new AesGcm(this.key, 16);
            aes.Encrypt(nonce, plaintextBytes, cipher, tag);

            return (
                Convert.ToBase64String(cipher),
                Convert.ToBase64String(nonce),
                Convert.ToBase64String(tag));
        }

        /// <inheritdoc/>
        public string Decrypt(string cipherText, string nonceText, string tagText)
        {
            if (string.IsNullOrEmpty(cipherText))
            {
                return cipherText;
            }

            var cipher = Convert.FromBase64String(cipherText);
            var nonce = Convert.FromBase64String(nonceText);
            var tag = Convert.FromBase64String(tagText);

            var plaintext = new byte[cipher.Length];

            using var aes = new AesGcm(this.key, 16);
            aes.Decrypt(nonce, cipher, tag, plaintext);

            return Encoding.UTF8.GetString(plaintext);
        }
    }
}
