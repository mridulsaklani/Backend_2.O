import { Schema, model } from "mongoose";
import { OTP_TYPES } from "../constants/enums.js";

const OTPSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: Number,
      required: true,
    },
    types: {
      type: String,
      enum: Object.values(OTP_TYPES),
    },
    expiration: {
      type: Date,
      required: true,
      expires: 0,
    },
    isUsed: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default model("otp", OTPSchema);
