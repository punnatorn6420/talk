using System;

namespace NokAir.TalkToCeo.Shared.Services
{
    /// <summary>
    /// Defines an interface for AES-GCM encryption and decryption services. This interface provides methods for encrypting plain text using the AES-GCM encryption algorithm and decrypting cipher text back to plain text. The Encrypt method takes a plain text string as input and returns a tuple containing the encrypted cipher text, the nonce used for encryption, and the authentication tag generated during the encryption process. The Decrypt method takes the cipher text, nonce, and authentication tag as input and returns the decrypted plain text. This interface allows for secure encryption and decryption of sensitive data while ensuring data integrity and authenticity through the use of AES-GCM.
    /// </summary>
    public interface IAesGcmService
    {
        /// <summary>
        /// Encrypts the specified plain text using AES-GCM encryption algorithm and returns the cipher text along with the nonce and authentication tag. The method takes a plain text string as input and returns a tuple containing the encrypted cipher text, the nonce used for encryption, and the authentication tag generated during the encryption process. This allows for secure encryption of sensitive data while ensuring data integrity and authenticity through the use of AES-GCM.
        /// </summary>
        /// <param name="plainText">The plain text to be encrypted.</param>
        /// <returns>A tuple containing the encrypted cipher text, the nonce, and the authentication tag.</returns>
        (string Cipher, string Nonce, string Tag) Encrypt(string plainText);

        /// <summary>
        /// Decrypts the specified cipher text using AES-GCM encryption algorithm and returns the plain text. The method takes the cipher text, nonce, and authentication tag as input and returns the decrypted plain text. This allows for secure decryption of encrypted data while ensuring data integrity and authenticity through the use of AES-GCM.
        /// </summary>
        /// <param name="cipherText">The cipher text to be decrypted.</param>
        /// <param name="nonceText">The nonce used during encryption.</param>
        /// <param name="tagText">The authentication tag generated during encryption.</param>
        /// <returns>The decrypted plain text.</returns>
        string Decrypt(string cipherText, string nonceText, string tagText);
    }
}
