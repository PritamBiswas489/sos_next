import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.NEXT_PUBLIC_CRYPTO_SECRET || "my-secret-key";

// 🔐 Encrypt
export const encryptData = (data) => {
  return CryptoJS.AES.encrypt(
    JSON.stringify(data),
    SECRET_KEY
  ).toString();
};

// 🔓 Decrypt
export const decryptData = (cipherText) => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (error) {
    return null;
  }
};