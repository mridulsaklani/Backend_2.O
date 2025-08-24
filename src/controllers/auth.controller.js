import userService from "../services/user.service.js";
import { apiResponse } from "../utils/apiResponse.utils.js";

class AuthController{

    createUser = async(req, res, next)=> {
         
        try {
           
            const payload = req.body;
            const result = await userService.createUser(payload)
            return res.status(201).json(new apiResponse(201, "User created successfully", result))
        } catch (error) {
            next(error)
        }
        
    }

    verifyUser = async(req,res,next)=>{
        try {
            const payload = req.body;
            const result = await userService.verifyUser(payload)
            return res.status(200).json(new apiResponse(200, "User verified successfully", result))

        } catch (error) {
            next(error)
        }
    }

    resendVerificationOTP = async(req,res,next)=>{
        try {
            const payload = req.body;
            await userService.resendVerificationOtp(payload);
            return res.status(200).json(new apiResponse(200, "Verification otp send successfully"))
        } catch (error) {
            next(error)
        }
    }

    getAllUser = async(req,res,next)=>{
        try {
            const result = await userService.getAllUsers()
            return res.status(200).json(new apiResponse(200, "All user get successfully", result))
        } catch (error) {
            next(error)
        }
    }
}

const authController = new AuthController()

export default authController