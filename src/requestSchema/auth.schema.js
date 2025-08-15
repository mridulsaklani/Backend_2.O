import {z} from "zod"
import {USER_STATUS} from "../constants/enums.js"


const createUserSchema = z.object({
    name: z.string().min(3, {message: "Please enter at list 3 letter name"}).regex(/^[A-Za-z]+$/, { message: "Name must contain only alphabets (A-Z, a-z)"}),
    username: z.string().regex(/^(?=.{5,34}$)(?!.*[_.]{2})[a-zA-Z][a-zA-Z0-9._]*[a-zA-Z0-9]$/, {message: "Invalid username formate"}).min(5).max(34),
    email: z.email().regex(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, {message: "invalid email type"}),
    phone: z.number().min(8,{message: "Number should minimum 8 characters"}),
    status: z.enum(Object.values(USER_STATUS), {message: "Invalid status type"}).optional(),
    isOtpVerified: z.boolean().optional()
    
})

export {
    createUserSchema
}