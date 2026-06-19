import {Router} from "express"
import validate from "../middlewares/validate.middleware"
import { blogCategorySchema, updateBlogCategorySchema, bulkDeleteSchemaForBlogs } from "../requestSchema/blog.schema"
import authorize from "../middlewares/auth"
import { USER_ROLE } from "../constants/enums"
import blogCategoryController from "../controllers/blogCategoryController"


const router = Router()

router.route("/").post(validate(blogCategorySchema), authorize([USER_ROLE.ADMIN]), blogCategoryController.create).get(authorize([USER_ROLE.ADMIN]), blogCategoryController.getAll)
router.route("/frontend").get(authorize([USER_ROLE.ADMIN, USER_ROLE.USER]), blogCategoryController.getAllforFrontend)
router.route("/slug/:slug").get(authorize([USER_ROLE.ADMIN, USER_ROLE.USER]), blogCategoryController.getBySlug)
router.route('/status/:id').patch(authorize([USER_ROLE.ADMIN]), blogCategoryController.toggleStatus)
router.route('/update/:id').put(validate(updateBlogCategorySchema), authorize([USER_ROLE.ADMIN]), blogCategoryController.update)
router.route('/delete/:id').delete(authorize([USER_ROLE.ADMIN]), blogCategoryController.delete)
router.route("/bulk-delete").delete(validate(bulkDeleteSchemaForBlogs), authorize([USER_ROLE.ADMIN]), blogCategoryController.bulkDelete)

export default router