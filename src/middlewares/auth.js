import userRepository from "../repositories/user.repository.js";
import { apiError } from "../utils/apiError.utils.js";
import { apiResponse } from "../utils/apiResponse.utils.js";
import { tokenDecoding } from "../utils/jwt.utils.js";


const authorize = (allowRole = [])=>{
     return async (req,res,next)=>{
        try {
            const token = req.cookies.accessToken;
        if(!token){
           return res.status(401).json(new apiError(401, "Access Token is required"))
        }

        const payload = tokenDecoding(token)

         if (!payload) {
                return res.status(401).json(new apiError(401, "Invalid or expired token"));
            }

        const user = await userRepository.findOne({_id: payload._id}, "_id name role isVerified")

        console.log("user: ", user)

        if(!user){
          return  res.status(400).json(new apiError(400, "Invalid user"))
        }

        if(!user.isVerified){
            return res.status(401).json(new apiError(401, "account is not verified"))
        }

        if(!allowRole.includes(user.role)){
            return res.status(401).json(new apiError(401, "You are not allowed to access"))
        }

        req.user = user
       next()
        } catch (error) {
            next(error)
        }
        
     }
}

export default authorize