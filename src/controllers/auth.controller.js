import { accessTokenExpiry, refreshTokenExpiry } from "../constants/constant.js";
import userService from "../services/user.service.js";
import { apiResponse } from "../utils/apiResponse.utils.js";

class AuthController{

    createUser = async(req, res, next)=> {
         
        try {
           
            const payload = req.body;
            const image = req.file ? req.file.path : null
            const result = await userService.createUser(payload,image)
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

    login = async(req,res,next)=>{
        try {
            const payload = req.body;
            const {_id, name, accessToken, refreshToken} = await userService.login(payload)
            const options = {
                httpOnly: true,
                secure: true,
                sameSite: "None",
            }
            res.cookie('accessToken', accessToken, {...options, maxAge: accessTokenExpiry}).cookie("refreshToken", refreshToken, {...options, maxAge: refreshTokenExpiry})
            return res.status(200).json(new apiResponse(200, "User logged in successfully", {id:_id,name}))
        } catch (error) {
            next(error)
        }
    }

    logout = async(req,res,next)=>{
         try {
            const id = req.user._id
             await userService.logout(id)

             const options = {
                httpOnly: true,
                secure: true,
                sameSite: "None",
            }
             
            res.clearCookie("accessToken", options).clearCookie("refreshToken")

            return res.status(200).json(new apiResponse(200, "User logged out successfully"))
         } catch (error) {
            next(error)
         }
    }
}

const authController = new AuthController()

export default authController