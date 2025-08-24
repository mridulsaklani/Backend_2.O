import baseRepository from "./base.repositories.js";
import otp from "../models/otp.model.js";
import { apiError } from "../utils/apiError.utils.js";

class OtpRepository extends baseRepository{
    constructor(){
        super(otp)
    }

    findLatestOtp = async(filter = {}, projection = null, session = null)=>{
      const result = await this.model.findOne(filter).select(projection).sort({createdAt: -1}).session(session);

       if(!result){
        
        throw new apiError(404, "OTP is expired or invelid credentials")
      }
      
      if(new Date(result.expiration).getTime() < Date.now() || result.isUsed === true){
        throw new apiError(400, "Expired OTP or already been used")
      }

      return result
    }

}

const otpRepository = new OtpRepository();

export default otpRepository;