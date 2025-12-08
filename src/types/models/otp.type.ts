import { Document } from "mongoose";


export interface OTPDocument extends Document {
    email: string;
    otp: number;
    types: string;
    expiration: Date;
    isUsed: boolean
}