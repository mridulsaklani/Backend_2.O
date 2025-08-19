import {Router} from "express"
import validate from "../middlewares/validate.middleware.js"
import {createUserSchema} from "../requestSchema/auth.schema.js"


const router = Router()

router.route('/').post(validate(createUserSchema), )


export default router