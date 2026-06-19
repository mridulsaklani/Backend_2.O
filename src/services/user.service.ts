import crypto from "crypto";
import { apiError } from "../utils/apiError.utils";
import mongoose, { Types, startSession } from "mongoose";
import generateOTP from "../utils/otp.utils";
import { sendOtpMail, sendVerificationLink } from "../utils/mailer.utils";
import { OTP_TYPES, VERIFICATION_LINK_TYPE } from "../constants/enums";
import otpRepository from "../repositories/otp.repository";

import UserRepository from "../repositories/user.repository";

import {
  decryptData,
  hashEmail,
  generateVerificationToken,
} from "../plugins/encryption.plugin";
import { otpExpiry, verificationLinkExpiry } from "../constants/constant";
import { uploadProfileImage } from "../utils/cloudinary.utils";
import verificationLinkRepository from "../repositories/verificationLink.repository";
import { ChangePasswordDto, CreateUserDto, EmailChangeDto, ForgetPasswordDto, ForgetPasswordOtpDto, LoginUserDto, ResendOTPDto, UpdateUserDto, VerifyOptDto } from "../requestSchema/auth.schema";
import { UserDocument } from "../types/models/user.type";
import { VerifyLoginInstance } from "../types/interfaces/auth.interfaces";

const projection = "-password -refreshToken";

const userRepository = new UserRepository()

class UserService {
  protected repository: typeof userRepository
  protected otpRepository: typeof otpRepository

  constructor(){
    this.repository = userRepository
    this.otpRepository = otpRepository
  }
  createUser = async (payload: CreateUserDto, image:string | null): Promise<UserDocument> => {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const hashMail = hashEmail(payload.email);
      const isUserExist = await userRepository.checkUserExist(
        { hashEmail: hashMail, username: payload.username },
        "email username",
        session
      );
      
      if (isUserExist) {
        throw new apiError(
          400,
          isUserExist.username.trim() === payload.username.trim()
            ? "You already have an account by using this username"
            : "You already have an account by using this email"
        );
      }

      const otp:number = generateOTP();

      await sendOtpMail(payload.email, String(otp), OTP_TYPES.EMAIL_VERIFICATION);

      await otpRepository.create(
        {
          email: payload.email,
          otp,
          types: OTP_TYPES.EMAIL_VERIFICATION,
          expiration: otpExpiry,
        },
        session
      );

      let uploadResult;

      if (image) {
        uploadResult = await uploadProfileImage(image);
      }

      const user = await userRepository.create(
        {
          ...payload,
          profileImage: {
            image: uploadResult ? uploadResult.url : null,
            key: uploadResult ? uploadResult.key : null,
          },
        },
        session
      );

      await session.commitTransaction();

      return user;
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error(error);
      }
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  };

  resendVerificationOtp = async (payload: ResendOTPDto):Promise<boolean> => {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const hashMail = hashEmail(payload.email);
      const isUserExist = await userRepository.findOne(
        { hashEmail: hashMail },
        "email",
        session
      );

      if (!isUserExist) {
        throw new apiError(404, "Invalid user, not exist");
      }

      const otp:number = generateOTP();

      await sendOtpMail(payload.email, String(otp), OTP_TYPES.EMAIL_VERIFICATION);

      const isOtpCreate = await otpRepository.create(
        {
          email: payload.email,
          otp,
          types: OTP_TYPES.EMAIL_VERIFICATION,
          expiration: otpExpiry,
        },
        session
      );

      if (!isOtpCreate) {
        throw new apiError(500, "Failed to create OTP");
      }

      await session.commitTransaction();
      return true;
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error(error);
      }
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  };

  verifyUser = async (payload: VerifyOptDto) => {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const otpData = await this.otpRepository.findLatestOtp(
        { email: payload.email, types: OTP_TYPES.EMAIL_VERIFICATION },
        "email otp isUsed",
        session
      );

      if (Number(otpData.otp) !== Number(payload.otp.trim())) {
        throw new apiError(400, "Invalid OTP, is not matching");
      }

      const updateResult = await otpRepository.updateOne(
        { email: payload.email },
        { isUsed: true },
        session
      );

      if (updateResult.modifiedCount === 0) {
        throw new apiError(400, "OTP not updated");
      }

      const hashMail = hashEmail(payload.email);
      const updateUser = await userRepository.findOneAndUpdate(
        { hashEmail: hashMail },
        { isVerified: true },
        session
      );

      if (updateUser.modifiedCount === 0) {
        throw new apiError(400, "User not exist or User verified not updated");
      }

      await session.commitTransaction();

      return updateResult;
    } catch (error) {
      await session.abortTransaction();
      if (process.env.NODE_ENV === "development") {
        console.error(error);
      }
      throw error;
    } finally {
      await session.endSession();
    }
  };

  getAllUsers = async (): Promise<Array<UserDocument>> => {
    try {
      const users: Array<UserDocument> = await userRepository.getAll({}, projection, {
        createdAt: -1,
      });

      for(let item of users){
        item.email = decryptData(item.email)
      }

      return users;
    } catch (error) {
      throw error;
    }
  };

  findById = async (id:string): Promise<UserDocument> => {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new apiError(404, "Invalid object id format");
      }

      const result = await userRepository.findOne({ _id: id }, projection);
      if (!result) {
        throw new apiError(404, "Invalid user, data not found");
      }
      return result;
    } catch (error) {
      throw error;
    }
  };

  login = async (payload: LoginUserDto): Promise<boolean> => {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const hashMail = hashEmail(payload.email);

      const user = await userRepository.findByHashedEmail(
        hashMail,
        "-refreshToken",
        session
      );

      if (!user) {
        throw new apiError(400, "Invalid email or password");
      }

      if (user.isLocked === true) {
        throw new apiError(
          423,
          "Your account is locked, please contact with admin"
        );
      }

      if (!user.isVerified) {
        throw new apiError(403, "Please verify your email first");
      }

      const isPasswordValid = await user.isPasswordCorrect(payload.password);

      if (!isPasswordValid) {
        throw new apiError(401, "Invalid password");
      }

      const verificationToken = generateVerificationToken();

      const isCreated = await verificationLinkRepository.create(
        {
          userId: user._id,
          token: verificationToken.hashedToken,
          expiresAt: verificationLinkExpiry,
        },
        session
      );
      

      if (!isCreated) {
        throw new apiError(400, "Verification link not saved");
      }

      const verificationURL:string = `${process.env.CLIENT_URL}/confirm-login?token=${verificationToken.verificationToken}&userId=${user._id}`;

      console.log("verification Token: ", verificationURL)

      const decryptedEmail:string = decryptData(user.email);

      const result = await sendVerificationLink(
        decryptedEmail,
        verificationURL,
        VERIFICATION_LINK_TYPE.LOGIN
      );

      if(!result){
        throw new apiError(400, "Email send failed")
      }

      await session.commitTransaction();

      return true;

    } catch (error) {
      await session.abortTransaction();
      if (process.env.NODE_ENV === "development") {
        console.error(error);
      }
      throw error;
    } finally {
      await session.endSession();
    }
  };

  verifyLogin = async (token:string, userId: string): Promise<VerifyLoginInstance> => {
    const session = await startSession();

    try {
      session.startTransaction();

      const hashedToken = hashEmail(token);

      const getTokenData = await verificationLinkRepository.findOne(
        { userId, token: hashedToken, used: false },
       "",
        session
      );
      if (!getTokenData) {
        throw new apiError(404, "Verification token not found in database");
      }

      const user = await userRepository.findById(userId, "", session);

      if (!user) {
        throw new apiError(404, "User not found");
      }

      const accessToken = await user.generateAccessToken();
      const refreshToken = await user.generateRefreshToken();

      const loginCount = (user.loginCount || 0) + 1;

      const isUpdate = await userRepository.updateLastLogin(
        user._id,
        refreshToken,
        loginCount,
        session
      );

      if (!isUpdate) {
        throw new apiError(400, "User not logged in, data not updated");
      }

      getTokenData.used = true;

      await getTokenData.save({ session });

      await session.commitTransaction();
      return { _id: user._id, name: user.name, accessToken, refreshToken };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  };

  forgotPassword = async (payload: ForgetPasswordDto): Promise<boolean> => {
    const session = await startSession();
    try {
      session.startTransaction();

      const hashMail = hashEmail(payload.email);
      const user = await userRepository.findByHashedEmail(
        hashMail,
        "-password -refreshToken",
        session
      );
      if (!user) {
        throw new apiError(401, "Invalid user or email");
      }

      const otp:number = generateOTP();
      await sendOtpMail(payload.email, String(otp), OTP_TYPES.PASSWORD_RESET);
      const sendOTP = await otpRepository.create(
        {
          email: payload.email,
          otp,
          types: OTP_TYPES.PASSWORD_RESET,
          expiration: otpExpiry,
        },
        session
      );
      if (!sendOTP) {
        throw new apiError(400, "Failed to send otp");
      }

      await session.commitTransaction();
      return true;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  };

  resetUserPassword = async (payload: ForgetPasswordOtpDto): Promise<UserDocument> => {
    const session = await startSession();
    try {
      session.startTransaction();
      const otpData = await otpRepository.findLatestOtp(
        { email: payload.email, types: OTP_TYPES.PASSWORD_RESET },
        "email otp isUsed",
        session
      );

      if (Number(otpData.otp) !== Number(payload.otp)) {
        throw new apiError(400, "Invalid otp, please try again");
      }
      const hashMail = hashEmail(payload.email);

      const user = await userRepository.findByHashedEmail(
        hashMail,
        projection,
        session
      );
      if (!user) {
        throw new apiError(404, "User not found");
      }

      otpData.isUsed = true;
      await otpData.save({ session });

      user.password = payload.password;

      await user.save({ session });

      await session.commitTransaction();
      return user;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  };

  updateUser = async (payload: UpdateUserDto, userId: string): Promise<UserDocument> => {
    try {
      if (!Types.ObjectId.isValid(userId)) {
        throw new apiError(400, "Invalid mongoose user Id");
      }

      const isUpdate = await userRepository.findByIdAndUpdate(userId, payload);
      if (!isUpdate) {
        throw new apiError(400, "User profile not updated");
      }

      return isUpdate;
    } catch (error) {
      throw error;
    }
  };

  changeEmailRequest = async (payload: EmailChangeDto, userId: string): Promise<boolean> => {
    const session = await startSession();
    try {
      session.startTransaction();

      const user = await userRepository.findById(userId, "", session);

      const oldEmail = decryptData(user.email);
      
      if (String(oldEmail).trim() === String(payload.email).trim()) {
        throw new apiError(
          400,
          "Your new email is matching with your old email, please use different email"
        );
      }
      const hashedMail = hashEmail(payload.email);
      const isUserExist = await userRepository.findByHashedEmail(
        hashedMail,
        "",
        session
      );
      if (isUserExist) {
        throw new apiError(
          400,
          "Email is already exist, please use different email"
        );
      }

      const otp = generateOTP();

      const sendOtp = await sendOtpMail(
        payload.email,
        String(otp),
        OTP_TYPES.EMAIL_VERIFICATION
      );

      if (!sendOtp) {
        throw new apiError(400, "Failed to send verification OTP");
      }

      await otpRepository.create(
        {
          email: payload.email,
          otp,
          types: OTP_TYPES.EMAIL_VERIFICATION,
          expiration: otpExpiry,
        },
        session
      );

      await session.commitTransaction();

      return true;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  };

  VerifyChangeEmailOtp = async (payload: VerifyOptDto, userId: string): Promise<UserDocument> => {
    const session = await startSession();
    try {
      session.startTransaction();

      const otpData = await otpRepository.findLatestOtp(
        { email: payload.email, types: OTP_TYPES.EMAIL_VERIFICATION },
        "",
        session
      );

      if (Number(otpData.otp) !== Number(payload.otp)) {
        throw new apiError(400, "Invalid otp, please try again");
      }

      const User = await userRepository.findById(userId, "", session);
      if (!User) {
        throw new apiError(404, "User not found for this email");
      }

      User.email = payload.email;
      await User.save({ session });
      await session.commitTransaction();
      return User;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  };

  changePasswordRequest = async (payload: ChangePasswordDto, userId: string): Promise<boolean> => {
    const session = await startSession();
    try {
      session.startTransaction();

      const user = await userRepository.findById(userId, "", session);

      const isPasswordValid = await user.isPasswordCorrect(payload.oldPassword);

      if (!isPasswordValid) {
        throw new apiError(
          400,
          "Incorrect previous password, please try again"
        );
      }

      user.password = payload.newPassword;
      await user.save({ session });
      await session.commitTransaction();
      return true;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  };

  logout = async (id: string): Promise<boolean> => {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new apiError(400, "Unauthorized User");
      }
      await userRepository.findOneAndUpdate(
        { _id: id },
        { refreshToken: null }
      );
      return true;
    } catch (error) {
      throw error;
    }
  };
}

const userService = new UserService();

export default userService;
