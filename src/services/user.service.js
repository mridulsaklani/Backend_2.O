import crypto from "crypto";

import { apiError } from "../utils/apiError.utils.js";
import mongoose from "mongoose";
import generateOTP from "../utils/otp.utils.js";
import { sendOtpMail } from "../utils/mailer.utils.js";
import {OTP_TYPES} from "../constants/enums.js"
import otpRepository from "../repositories/otp.repository.js"

import userRepository from "../repositories/user.repository.js";

import { hashEmail } from "../plugins/encryption.plugin.js";
import { otpExpiry } from "../constants/constant.js";

const projection = "-password -refreshToken"

class UserService {


  createUser = async (payload) => {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const hashMail = hashEmail(payload.email);
      const isUserExist = await userRepository.findOne({ hashEmail: hashMail }, "email", session);
      if (isUserExist) {
        throw new apiError(
          400,
          "You already have an account by using this email"
        );
      }
      
      const otp = generateOTP()

      

      // await sendOtpMail(payload.email, otp, OTP_TYPES.EMAIL_VERIFICATION)


      await otpRepository.create({email: payload.email, otp, types:  OTP_TYPES.EMAIL_VERIFICATION,expiration: otpExpiry }, session);
      
      const user = await userRepository.create(payload, session)

      await session.commitTransaction()

      return user
      
      

    } catch (error) {
        if(process.env.NODE_ENV === "development"){
          console.error(error)
        }
        await session.abortTransaction()
      throw error;
    } finally{
        await session.endSession()
    }
  };

  resendVerificationOtp = async(payload) => {
    const session = await mongoose.startSession()
    try {
       session.startTransaction();
      const hashMail = hashEmail(payload.email);
      const isUserExist = await userRepository.findOne({hashEmail: hashMail}, "email", session);

      if(!isUserExist){
        throw new apiError(404, "Invalid user, not exist")
      }

      const otp = generateOTP()
      const isOtpCreate =  await otpRepository.create({email: payload.email, otp, types:  OTP_TYPES.EMAIL_VERIFICATION, expiration: otpExpiry }, session)
      
      if(!isOtpCreate){
        throw new apiError(500, "Failed to create OTP")
      }

      await session.commitTransaction()
      return isOtpCreate
    } catch (error) {
      if(process.env.NODE_ENV === "development"){
          console.error(error)
        }
      await session.abortTransaction()
      throw error;
    }
    finally{
      await session.endSession()
    }
  }


  verifyUser = async(payload)=>{
    const session = await mongoose.startSession()
    try {
      session.startTransaction()
      const otpData = await otpRepository.findLatestOtp({email: payload.email, types: OTP_TYPES.EMAIL_VERIFICATION}, "email otp isUsed", session)

      if(Number(otpData.otp) !== Number(payload.otp.trim())){
        throw new apiError(400, "Invalid OTP, is not matching")
      }

      const updateResult =  await otpRepository.updateOne({email: payload.email}, {isUsed: true}, session);

      if(updateResult.modifiedCount === 0){
        throw new apiError(400, "OTP not updated")
      }
      
      const hashMail = hashEmail(payload.email)
      const updateUser = await userRepository.findOneAndUpdate({hashEmail: hashMail}, {isVerified: true}, session)

      if(updateUser.modifiedCount === 0){
        throw new apiError(400, "User not exist or User verified not updated")
      }

      await session.commitTransaction()

      return updateResult
      
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally{
      await session.endSession()
    }
  }

  getAllUsers = async()=>{
    try {
      const users = await userRepository.getAll({}, projection, {createdAt: -1} )
      return users
    } catch (error) {
      throw error
    }
  }


}

const userService = new UserService()


export default userService;
