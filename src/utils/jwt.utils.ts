import jwt from "jsonwebtoken";

export const tokenDecoding = (token: string): any => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_KEY as string);
};