import nodemailer from "nodemailer";
import {OTP_TYPES} from "../constants/enums.js"
import { apiError } from "./apiError.utils.js";

const transporter = nodemailer.createTransport({
   
  service: "gmail", 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, 
  },
});

export async function sendOtpMail(to, otp, type) {
   
    let subject;
   switch (type) {
    case OTP_TYPES.EMAIL_VERIFICATION:
        subject = "OTP for email verification"
        break;

    case OTP_TYPES.LOGIN_OTP:
        subject = "OTP for Login"
        break

    case OTP_TYPES.PASSWORD_RESET:
        subject = "OTP for password reset"
        break
    default:
        subject = "OTP for verification"
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
  return true
  } catch (error) {
    console.log("pass", process.env.EMAIL_PASS, process.env.EMAIL_USER)
    if(process.env.NODE_ENV === "development"){
        console.error(error)
    }
    throw new apiError(500, "failed to send otp", error)
  }

  
}
