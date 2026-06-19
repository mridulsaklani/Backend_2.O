import jwt, { Algorithm, Secret, SignOptions } from "jsonwebtoken";

export const tokenDecoding = (token: string): any => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_KEY as string);
};

export const createToken = (
  payload: Record<string, any>,
  expiresIn: string,
): string => {
  if (!process.env.ACCESS_TOKEN_KEY || !process.env.GLOBAL_TOKEN_KEY || !process.env.ALGORITHM) {
    throw new Error("JWT keys missing in env");
  }
  const options = {
    expiresIn,
    algorithm: process.env.ALGORITHM,
  };

  return jwt.sign(payload, process.env.GLOBAL_TOKEN_KEY as Secret, options);
};
