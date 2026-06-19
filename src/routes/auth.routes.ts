import {Router} from "express"
import validate from "../middlewares/validate.middleware"
import {createUserSchema, verifyOtpSchema, resendOtpSchema, loginSchema, forgotPasswordSchema, forgotPasswordOTPSchema, UpdateUserSchema, EmailChangeSchema, PasswordChangeSchema, verifyLoginQuerySchema} from "../requestSchema/auth.schema"
import authController from "../controllers/auth.controller"
import upload from "../config/multer.config"
import authorize from "../middlewares/auth"
import rateLimiter from "../config/rateLimiter.config"
import {REQUEST_SOURCE} from "../constants/enums"


const router = Router()

router.route('/').post(upload.single("profileImage"), validate(createUserSchema), authController.createUser).get(authController.getAllUser);
router.route('/single/:id').get(authorize(['admin', 'user']), authController.findById);
router.route('/verify-user').post(validate(verifyOtpSchema), authController.verifyUser);
router.route('/resend-otp').post(validate(resendOtpSchema), authController.resendVerificationOTP);
router.route('/password/forgot-password').post(validate(forgotPasswordSchema), authController.forgotPassword);
router.route('/password/verify-and-reset').post(validate(forgotPasswordOTPSchema), authController.resetUserPassword);
router.route('/login').post(validate(loginSchema), rateLimiter.loginLimiter(), authController.login);
router.route('/confirm-login').post(validate(verifyLoginQuerySchema, REQUEST_SOURCE.QUERY), authController.verifyLogin);
router.route('/profile/update').put(authorize(['user', 'admin']), validate(UpdateUserSchema), authController.updateUser);
router.route('/change-email').post(authorize(['user', 'admin']), validate(EmailChangeSchema), authController.changeEmailRequest)
router.route('/verify-change-email').post(authorize(['user', 'admin']), validate(verifyOtpSchema), authController.VerifyChangeEmailOtp);
router.route('/change-password').post(authorize(['user', 'admin']), validate(PasswordChangeSchema), authController.changePasswordRequest);
router.route('/logout').post(authorize(['user', 'admin']), authController.logout);

export default router