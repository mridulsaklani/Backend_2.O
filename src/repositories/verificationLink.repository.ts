
import VerificationTokenSchema from "../models/VerificationTokenSchema"
import baseRepository from "./base.repositories"

class VerificationLinkRepository extends baseRepository{
      constructor(){
        super(VerificationTokenSchema)
      }




}

const verificationLinkRepository = new VerificationLinkRepository();

export default verificationLinkRepository