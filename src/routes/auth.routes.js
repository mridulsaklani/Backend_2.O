import {Router} from "express"
import validate from "../middlewares/validate.middleware.js"
import {createUserSchema, verifyOtpSchema, resendOtpSchema} from "../requestSchema/auth.schema.js"
import authController from "../controllers/auth.controller.js"


const router = Router()

router.route('/').post(validate(createUserSchema), authController.createUser).get(authController.getAllUser)

router.route('/verify-user').post(validate(verifyOtpSchema), authController.verifyUser)

router.route('/resend-otp').post(validate(resendOtpSchema), authController.resendVerificationOTP)

// router.route('/login').post()



export default router