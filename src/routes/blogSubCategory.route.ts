import {Router} from "express"
import authorize from "../middlewares/auth"
import { REQUEST_SOURCE, USER_ROLE } from "../constants/enums"
import validate from "../middlewares/validate.middleware"
import { blogSubCategorySchema, updateBlogCategorySchema } from "../requestSchema/blog.schema"
import blogSubCategoryController from "../controllers/blogSubCategory.controller"


const router = Router()


router.route("/create").post(validate(blogSubCategorySchema, REQUEST_SOURCE.BODY), authorize([USER_ROLE.ADMIN]), blogSubCategoryController.create);
router.route("/all").get(authorize([USER_ROLE.ADMIN]), blogSubCategoryController.getAll)
router.route("/update/:id").post(validate(updateBlogCategorySchema, REQUEST_SOURCE.BODY), authorize([USER_ROLE.ADMIN]), blogSubCategoryController.update)
router.route("/delete/:id").delete(authorize([USER_ROLE.ADMIN]), blogSubCategoryController.delete)


export default router