
import User from "../models/user.model.js"
import baseRepository from "./base.repositories.js";

class UserRepository extends baseRepository{
     constructor(){
        super(User)
     }

     
}

const userRepository = new UserRepository()
export default userRepository