const crypto = require("crypto");

const algorithm = "aes-256-cbc";
const key = process.env.CRYPTO_KEY;
const iv = process.env.CRYPTO_IV


export function encryptEmail(email) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(email, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

export function decryptEmail(encryptedEmail) {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedEmail, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}