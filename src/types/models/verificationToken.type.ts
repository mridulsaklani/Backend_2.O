import { Document, Types } from "mongoose";



export interface verificationTokenDocument extends Document {
    userId: Types.ObjectId;
    token: string;
    expiresAt: Date;
    used: boolean
}