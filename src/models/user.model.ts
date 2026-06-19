import { Schema, model } from "mongoose";
import { USER_ROLE, USER_STATUS } from "../constants/enums";
import bcrypt from "bcrypt";
import {
  encryptData,
  decryptData,
  hashEmail,
} from "../plugins/encryption.plugin";

import jwt, {SignOptions} from "jsonwebtoken";
import { UserDocument } from "../types/models/user.type";
import { Data } from "../types/type.constants";

const userModel = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
      match: [/^[A-Za-z ]+$/, "Name syntex not valid"],
      trim: true,
      lowercase: true,
    },
    profileImage: {
      image: {
        type: String,
        default: null
      },
      key: {
        type: String,
        default:null
      },
    },
    username: {
      type: String,
      minLength: [6, "Username must be minimum 8 characters"],
      maxLength: [34, "Username must be maximum 34 characters"],
      match: [
        /^(?=.{3,30}$)(?!.*[_.]{2})[a-zA-Z][a-zA-Z0-9._]*[a-zA-Z0-9]$/,
        "Invalid username syntax",
      ],
      required: true,
      trim: true,
      unique: true,
    },
    hashEmail: {
      type: String,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,

      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      match: [/^\+?[0-9]{10,15}$/, "Phone address is not valid"],
      minLength: [8, "Phone number must be at least 8 characters"],
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: "inactive",
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    loginCount: {
      type: Number,
      default: 0,
      min: [0, "Login count cannot be negative"],
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLE),
      required: true,
      default: USER_ROLE.USER,
    },
  },
  { timestamps: true }
);

userModel.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userModel.pre("save", async function (next) {
  if (!this.isModified("email")) return next();
  this.hashEmail = hashEmail(this.email);
  this.email = encryptData(this.email);
  next();
});

userModel.methods.getDecryptEmail = async function (encryptedEmail:string): Promise<string> {
  return decryptData(encryptedEmail);
};

userModel.methods.isPasswordCorrect = async function (password:string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

userModel.methods.generateAccessToken = async function (): Promise<string> {
  if (!process.env.ACCESS_TOKEN_KEY || !process.env.ACCESS_TOKEN_EXPIRY) {
    throw new Error("JWT configuration missing");
  }

  const payload: Data = {
    _id: this._id,
    hashEmail: this.hashEmail,
  };

  const secret = process.env.ACCESS_TOKEN_KEY as string;
  const expiresIn = process.env.ACCESS_TOKEN_EXPIRY as string | number;

  const options = { expiresIn } as SignOptions;

  return jwt.sign(payload, secret, options);
};

userModel.methods.generateRefreshToken = async function (): Promise<string> {
  if (!process.env.REFRESH_TOKEN_KEY || !process.env.REFRESH_TOKEN_EXPIRY) {
    throw new Error("JWT configuration missing");
  }

  const payload: Data = {
      _id: this._id,
  }

  const secret = process.env.REFRESH_TOKEN_KEY as string
  const expiresIn:string = process.env.REFRESH_TOKEN_EXPIRY as string;
  const options = { expiresIn } as SignOptions;

  return jwt.sign(
    payload,
    secret,
    options
  );
};

export default model("User", userModel);
