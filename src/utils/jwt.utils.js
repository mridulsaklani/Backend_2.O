import jwt from "jsonwebtoken"


export const tokenDecoding = (token)=>{
    return jwt.decode(token, process.env.ACCESS_TOKEN_KEY)
}