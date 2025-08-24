import {Schema, model} from "mongoose"
import {USER_STATUS} from "../constants/enums.js"
import bcrypt from "bcrypt"
import {encryptEmail, decryptEmail,  hashEmail} from "../plugins/encryption.plugin.js"


const userModel = new Schema({
    name: {
        type: String,
        required: [true, "User name is required"],
        match: [/^[A-Za-z ]+$/, "Name syntex not valid"],
        trim: true,
        lowercase: true
    },
    profileImage:{
        type: String,

    },
    username:{
       type: String,
       minLength: [6, "Username must be minimum 8 characters"],
       maxLength: [34, "Username must be maximum 34 characters"],
       match: [/^(?=.{3,30}$)(?!.*[_.]{2})[a-zA-Z][a-zA-Z0-9._]*[a-zA-Z0-9]$/, "Invalid username syntax"],
       required: true,
       trim: true,
       unique: true
    },
    hashEmail:{
      type: String,
      trim: true,
      unique: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        // match: [/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, "Email address is not valid"],
        trim:true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: [8, "Password must be min 8 characters long"],
         match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ]
    },
    phone: {
        type: String,
        required: true,
        match: [/^\+?[0-9]{10,15}$/, "Phone address is not valid"],
        minLength: [8, "Phone number must be at least 8 characters"],
        trim: true
    },
    status:{
        type: String,
        enum: Object.values(USER_STATUS),
        default: "inactive"
    },
    isVerified:{
        type: Boolean,
        default: false
    }

}, {timestamps: true})

userModel.pre("save", async function (next) {
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userModel.pre("save", async function(next){
    if(!this.isModified("email")) return next();
    this.hashEmail =  hashEmail(this.email)
    this.email = encryptEmail(this.email)
    next()
}) 


userModel.methods.getDecryptEmail = async function (encryptedEmail){
    return decryptEmail(encryptedEmail)
}

userModel.methods.isPasswordCorrect =async function (password){
    return await bcrypt.compare(password, this.password)
}


export default model("User", userModel)