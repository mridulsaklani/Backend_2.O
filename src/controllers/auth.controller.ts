import { promises } from "dns";
import {
  accessTokenExpiry,
  refreshTokenExpiry,
} from "../constants/constant";
import userService from "../services/user.service";
import { apiError } from "../utils/apiError.utils";
import { apiResponse } from "../utils/apiResponse.utils";
import { Controller } from "../types/type.constants";

class AuthController {
  public createUser: Controller = async (req, res, next) => {
    try {
      const payload = req.body;
      const image = req.file ? req.file.path : null;
      const result = await userService.createUser(payload, image);
      return res
        .status(201)
        .json(new apiResponse(201, "User created successfully", result));
    } catch (error) {
      next(error);
    }
  };

  public verifyUser: Controller = async (req, res, next) => {
    try {
      const payload = req.body;
      const result = await userService.verifyUser(payload);
      return res
        .status(200)
        .json(new apiResponse(200, "User verified successfully", result));
    } catch (error) {
      next(error);
    }
  };

  public resendVerificationOTP: Controller = async (req, res, next) => {
    try {
      const payload = req.body;
      await userService.resendVerificationOtp(payload);
      return res
        .status(200)
        .json(new apiResponse(200, "Verification otp send successfully"));
    } catch (error) {
      next(error);
    }
  };

 public getAllUser: Controller = async (req, res, next) => {
    try {
      const result = await userService.getAllUsers();
      return res
        .status(200)
        .json(new apiResponse(200, "All user get successfully", result));
    } catch (error) {
      next(error);
    }
  };

  public findById: Controller = async (req, res, next) => {
    try {
      const id = req.params.id;
      const response = await userService.findById(id);
      return res
        .status(200)
        .json(new apiResponse(200, "User fetched successfully", response));
    } catch (error) {
      next(error);
    }
  };

  public login: Controller = async (req, res, next) => {
    try {
      const payload = req.body;
      const result = await userService.login(payload);
      return res
        .status(200)
        .json(
          new apiResponse(
            200,
            "Credential accepted, Verification link send successfully"
          )
        );
    } catch (error) {
      next(error);
    }
  };

  public verifyLogin: Controller = async (req, res, next) => {
    try {
      const { token, userId } = req.query;
      const { _id, name, accessToken, refreshToken } =
        await userService.verifyLogin(token as string, userId as string);
      const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none" as const,
      };
      res
        .cookie("accessToken", accessToken, {
          ...options,
          maxAge: accessTokenExpiry,
        })
        .cookie("refreshToken", refreshToken, {
          ...options,
          maxAge: refreshTokenExpiry,
        });
      return res
        .status(200)
        .json(
          new apiResponse(200, "User logged in successfully", { id: _id, name })
        );
    } catch (error) {
      next(error);
    }
  };

  public forgotPassword: Controller = async (req, res, next) => {
    try {
      const payload = req.body;
      await userService.forgotPassword(payload);
      return res
        .status(200)
        .json(
          new apiResponse(
            200,
            "Verification otp for forget password send successfully on you mail"
          )
        );
    } catch (error) {
      next(error);
    }
  };

  public resetUserPassword: Controller = async (req, res, next) => {
    try {
      const payload = req.body;
      const result = await userService.resetUserPassword(payload);
      return res
        .status(200)
        .json(
          new apiResponse(
            200,
            `${result.name || "user"} password changed successfully `,
            result
          )
        );
    } catch (error) {
      next(error);
    }
  };

  public updateUser: Controller = async (req, res, next) => {
    try {
      const payload = req.body;
      const userId = req.user._id;

      const result = await userService.updateUser(payload, userId);
      return res
        .status(200)
        .json(new apiResponse(200, "Update user profile successfully", result));
    } catch (error) {
      next(error);
    }
  };

  public changeEmailRequest: Controller = async (req, res, next) => {
    try {
      const payload = req.body;
      const userId = req.user._id;

      await userService.changeEmailRequest(payload, userId);
      return res
        .status(200)
        .json(
          new apiResponse(
            200,
            "Change email request accepted and OTP send successfully on your new mail"
          )
        );
    } catch (error) {
      next(error);
    }
  };

  public VerifyChangeEmailOtp: Controller = async (req, res, next) => {
    try {
      const payload = req.body;
      const userId = req.user._id;
      await userService.VerifyChangeEmailOtp(payload, userId);
      return res
        .status(200)
        .json(
          new apiResponse(
            200,
            `You email is changed successfully to ${payload.email}`
          )
        );
    } catch (error) {
      next(error);
    }
  };

  public changePasswordRequest: Controller = async (req, res, next) => {
    try {
      const payload = req.body;
      const userId = req.user._id;
      const result = await userService.changePasswordRequest(payload, userId);
      return res
        .status(200)
        .json(new apiResponse(200, "Password changed successfully", result));
    } catch (error) {
      next(error);
    }
  };

  public logout: Controller = async (req, res, next) => {
    try {
      const id = req.user._id;
      await userService.logout(id);

      const options: Object = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      };

      res.clearCookie("accessToken", options).clearCookie("refreshToken");

      return res
        .status(200)
        .json(new apiResponse(200, "User logged out successfully"));
    } catch (error) {
      next(error);
    }
  };
}

const authController = new AuthController();

export default authController;
