import crypto from "crypto";
import {hashEmail} from "../plugins/encryption.plugin"

class userService{
    createUser = (payload) =>{
       const hashEmail =  hashEmail(payload.email)
       const isUserExist = await 
    }
}