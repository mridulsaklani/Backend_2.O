import UserRepository from "../repositories/user.repository";
import { apiError } from "../utils/apiError.utils";
import { apiResponse } from "../utils/apiResponse.utils";
import { tokenDecoding } from "../utils/jwt.utils";
import { Controller } from "../types/type.constants";
import { NextFunction, Request, Response } from "express";

const userRepository = new UserRepository()

const authorize = (allowRole: string[] = []) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.accessToken;
      
      if (!token) {
        return res
          .status(401)
          .json(new apiError(401, "Access Token is required"));
      }
      
      const payload = tokenDecoding(token);
       
      if (!payload) {
        return res
          .status(401)
          .json(new apiError(401, "Invalid or expired token"));
      }

      const user = await userRepository.findOne(
        { _id: payload._id },
        "_id name role isVerified"
      );

      if (!user) {
        return res.status(400).json(new apiError(400, "Invalid user"));
      }

      if (!user.isVerified) {
        return res
          .status(401)
          .json(new apiError(401, "account is not verified"));
      }

      if (!allowRole.includes(user.role)) {
        return res
          .status(401)
          .json(new apiError(401, "You are not allowed to access"));
      }

      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default authorize;
