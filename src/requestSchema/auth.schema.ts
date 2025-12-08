import {z} from "zod"
import {USER_STATUS} from "../constants/enums"

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format");

const createUserSchema = z.object({
    name: z.string().min(3, {message: "Please enter at list 3 letter name"}).regex(/^[A-Za-z ]+$/, { message: "Name must contain only alphabets (A-Z, a-z)"}),
    username: z.string().regex(/^(?=.{5,34}$)(?!.*[_.]{2})[a-zA-Z][a-zA-Z0-9._]*[a-zA-Z0-9]$/, {message: "Invalid username formate"}).min(5).max(34),
    email: z.email().regex(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, {message: "invalid email type"}),
    phone: z.string().min(8,{message: "Number should minimum 8 characters"}),
    password: z.string().min(8,{message: "Password length at list 8"}).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"}),
    
    
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

const forgotPasswordSchema = z.object({
    email: z.email().regex(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, {message: "invalid email type"}),
})

const forgotPasswordOTPSchema = z.object({
    email: z.email().regex(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, {message: "invalid email type"}),
    otp: z.string().min(6,{message: "OTP should be 6 digit"}).max(6,{message: "OTP should be 6 digit"}).regex(/^\d{6}$/, { message: "OTP must be exactly 6 digits" }),
    password: z.string().min(8,{message: "Password length at list 8"}).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"}),
})

const UpdateUserSchema = z.object({
    name: z.string().min(3, {message: "Please enter at list 3 letter name"}).regex(/^[A-Za-z ]+$/, { message: "Name must contain only alphabets (A-Z, a-z)"}),
    username: z.string().regex(/^(?=.{5,34}$)(?!.*[_.]{2})[a-zA-Z][a-zA-Z0-9._]*[a-zA-Z0-9]$/, {message: "Invalid username formate"}).min(5).max(34),
    email: z.email().regex(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, {message: "invalid email type"}),
    phone: z.string().min(8,{message: "Number should minimum 8 characters"}),
    
})

const EmailChangeSchema = z.object({
    email: z.email().regex(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, {message: "invalid email type"})
})



const PasswordChangeSchema = z.object({
    oldPassword: z.string().min(8,{message: "Password length at list 8"}).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"}),
    newPassword: z.string().min(8,{message: "Password length at list 8"}).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"})
})


const verifyLoginQuerySchema = z.object({
    token: z.string().length(64, "Invalid token format"),
    userId: objectIdSchema
});


// DTOS

type CreateUserDto = z.infer<typeof createUserSchema>
type VerifyOptDto = z.infer<typeof verifyOtpSchema>
type LoginUserDto = z.infer<typeof loginSchema>
type ResendOTPDto = z.infer<typeof resendOtpSchema>

type ForgetPasswordDto = z.infer<typeof forgotPasswordSchema>
type ForgetPasswordOtpDto = z.infer<typeof forgotPasswordOTPSchema>
type UpdateUserDto = z.infer<typeof UpdateUserSchema>
type EmailChangeDto = z.infer<typeof EmailChangeSchema>
type ChangePasswordDto = z.infer<typeof PasswordChangeSchema>

export {
    createUserSchema,
    verifyOtpSchema,
    resendOtpSchema,
    loginSchema, forgotPasswordSchema, forgotPasswordOTPSchema, UpdateUserSchema, EmailChangeSchema, PasswordChangeSchema, verifyLoginQuerySchema, CreateUserDto, VerifyOptDto, LoginUserDto, ResendOTPDto, ForgetPasswordDto, ForgetPasswordOtpDto, UpdateUserDto, EmailChangeDto, ChangePasswordDto
}