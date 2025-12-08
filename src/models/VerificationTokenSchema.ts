import {model, Schema} from "mongoose"
import { verificationTokenDocument } from "../types/models/verificationToken.type"

const verificationTokenModel = new Schema<verificationTokenDocument>({
     userId:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
     },
     token: { type: String, required: true, unique: true },
     expiresAt: { type: Date, required: true, expires: 0 },
     used: { type: Boolean, default: false }

}, {timestamps: true})

// verificationTokenModel.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });



export default model("verificationToken", verificationTokenModel)