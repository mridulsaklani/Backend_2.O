import {Router} from "express"
import validate from "../middlewares/validate.middleware.js"
import {createUserSchema, verifyOtpSchema, resendOtpSchema, loginSchema} from "../requestSchema/auth.schema.js"
import authController from "../controllers/auth.controller.js"
import upload from "../config/multer.config.js"
import authorize from "../middlewares/auth.js"


const router = Router()

router.route('/').post(upload.single("profileImage"), validate(createUserSchema), authController.createUser).get(authorize(['admin']), authController.getAllUser)
router.route('/verify-user').post(validate(verifyOtpSchema), authController.verifyUser)
router.route('/resend-otp').post(validate(resendOtpSchema), authController.resendVerificationOTP)
router.route('/login').post(validate(loginSchema), authController.login)
router.route('/logout').post(authorize(['user', 'admin']), authController.logout)

export default router