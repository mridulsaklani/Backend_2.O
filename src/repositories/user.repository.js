
import User from "../models/user.model"
import baseRepository from "./base.repositories";

class UserRepository extends baseRepository{
     constructor(){
        super(User)
     }
}


export default UserRepository