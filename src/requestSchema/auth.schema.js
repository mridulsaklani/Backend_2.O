import {email, z} from "zod"
import {USER_STATUS} from "../constants/enums.js"


const createUserSchema = z.object({
    name: z.string().min(3, {message: "Please enter at list 3 letter name"}).regex(/^[A-Za-z ]+$/, { message: "Name must contain only alphabets (A-Z, a-z)"}),
    username: z.string().regex(/^(?=.{5,34}$)(?!.*[_.]{2})[a-zA-Z][a-zA-Z0-9._]*[a-zA-Z0-9]$/, {message: "Invalid username formate"}).min(5).max(34),
    email: z.email().regex(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, {message: "invalid email type"}),
    phone: z.string().min(8,{message: "Number should minimum 8 characters"}),
    password: z.string().min(8,{message: "Password length at list 8"}).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"}),
    isOtpVerified: z.boolean().optional()
    
})

const verifyOtpSchema = z.object({
    email: z.email().regex(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, {message: "invalid email type"}),
    otp: z.string().min(6,{message: "OTP should be 6 digit"}).max(6,{message: "OTP should be 6 digit"}).regex(/^\d{6}$/, { message: "OTP must be exactly 6 digits" })
})

const resendOtpSchema = z.object({
    email: z.email().regex(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, {message: "invalid email type"})
})

const loginSchema = z.object({
     email: z.email().regex(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, {message: "invalid email type"}),
     password: z.string().min(8,{message: "Password length at list 8"}).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"}),
})

export {
    createUserSchema,
    verifyOtpSchema,
    resendOtpSchema,
    loginSchema
}