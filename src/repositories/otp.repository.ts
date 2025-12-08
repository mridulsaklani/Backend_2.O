import baseRepository from "./base.repositories";
import otp from "../models/otp.model";
import { apiError } from "../utils/apiError.utils";
import { Filters, Projection, Session } from "../types/type.constants";
import { OTPDocument } from "../types/models/otp.type";

class OtpRepository extends baseRepository{
    constructor(){
        super(otp)
    }

    public findLatestOtp = async(filter: Filters = {}, projection: Projection = "", session: Session = null): Promise<OTPDocument>=>{
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