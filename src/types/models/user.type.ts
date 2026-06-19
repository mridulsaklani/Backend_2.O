import { Document } from "mongoose";


export interface UserDocument extends Document {
    name: string;
    profileImage: ImageType;
    username: string;
    hashEmail: string;
    email: string;
    password: string;
    phone:string;
    status: string;
    lastLogin: Date;
    loginCount: number;
    isLocked: boolean;
    isVerified: boolean;
    refreshToken: string;
    role: string;
    getDecryptEmail(encryptedEmail:string): Promise<string>;
    isPasswordCorrect(password: string): Promise<boolean>;
    generateAccessToken(): Promise<string>
    generateRefreshToken(): Promise<string>
}