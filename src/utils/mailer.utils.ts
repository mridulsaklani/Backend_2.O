import nodemailer from "nodemailer";
import { OTP_TYPES, VERIFICATION_LINK_TYPE } from "../constants/enums";
import { apiError } from "./apiError.utils.js";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 40000,
} as SMTPTransport.Options);

export async function sendOtpMail(
  to: string,
  otp: string,
  type: string
): Promise<boolean> {
  let subject;
  switch (type) {
    case OTP_TYPES.EMAIL_VERIFICATION:
      subject = "OTP for email verification";
      break;

    case OTP_TYPES.LOGIN_OTP:
      subject = "OTP for Login";
      break;

    case OTP_TYPES.PASSWORD_RESET:
      subject = "OTP for password reset";
      break;
    default:
      subject = "OTP for verification";
      break;
  }

  const mailOptions = {
    from: `"mridulsinghsaklani.com" <${process.env.EMAIL_USER}>`,
    to,
    subject: subject,
    text: `Your OTP code is: ${otp}. It will expire in 5 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }
    throw new apiError(500, "failed to send otp", error as Error);
  }
}

export async function sendVerificationLink(
  to: string,
  link: string,
  type: string
): Promise<boolean> {
  let subject;
  switch (type) {
    case VERIFICATION_LINK_TYPE.LOGIN:
      subject = "Link for email verification";
      break;

    default:
      subject = "Link for verification";
      break;
  }

  const mailOptions = {
    from: `"Mridul Singh Saklani" <${process.env.EMAIL_USER}>`,
    to,
    subject: subject || "Verify Your Account - MridulSinghSaklani.com",
    text: `Your account verification link is: ${link}\n\nThis link will expire in 10 minutes.`,
    html: `
    <div style="
      font-family: 'Nunito', Arial, sans-serif;
      background-color: #f8f9fa;
      padding: 30px;
      border-radius: 12px;
      max-width: 600px;
      margin: auto;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    ">
      <h2 style="color: #2563EB; text-align: center;">Account Verification</h2>
      <p style="font-size: 16px; color: #333;">
        Hello,
      </p>
      <p style="font-size: 16px; color: #333;">
        Thank you for registering with <strong>MridulSinghSaklani.com</strong>!  
        Please verify your email address by clicking the button below.
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${link}" 
          style="
            background-color: #2563EB;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: bold;
            display: inline-block;
          "
          target="_blank">
          Verify My Account
        </a>
      </div>
      <p style="font-size: 14px; color: #555;">
        This link will expire in <strong>10 minutes</strong>.  
        If you didn’t request this, you can safely ignore this email.
      </p>
      <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 25px 0;">
      <p style="font-size: 13px; color: #888; text-align: center;">
        &copy; ${new Date().getFullYear()} MridulSinghSaklani.com. All rights reserved.
      </p>
    </div>
  `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    throw new apiError(500, "failed to send Verification Link", error as Error);
  }
}
