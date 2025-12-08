import crypto from "crypto"

const algorithm = "aes-256-cbc";

export function hashEmail(email: string){
    return crypto.createHash("sha256").update(email).digest('hex');
}

export function encryptEmail(email: string) {
   const key = Buffer.from(process.env.CRYPTO_KEY, 'hex');
  const iv = Buffer.from(process.env.CRYPTO_IV, 'hex');
  

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(email, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

export function decryptEmail(encryptedEmail: string) {
  const key = Buffer.from(process.env.CRYPTO_KEY, 'hex');
  const iv = Buffer.from(process.env.CRYPTO_IV, 'hex');
  

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedEmail, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}


export function generateVerificationToken(){
  const verificationToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');

      return {verificationToken, hashedToken}
}