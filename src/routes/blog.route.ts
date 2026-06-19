import {Router} from "express";
import validate from "../middlewares/validate.middleware";
import { createBlogSchema } from "../requestSchema/blog.schema";
import authorize from "../middlewares/auth";
import { USER_ROLE } from "../constants/enums";
import blogController from "../controllers/blog.controller";
import upload from "../config/multer.config";


const router = Router();

router.route('/').post(upload.single("coverImage"), validate(createBlogSchema), authorize([USER_ROLE.ADMIN, USER_ROLE.USER]), blogController.create).get(authorize([USER_ROLE.ADMIN, USER_ROLE.USER]), blogController.getAllPaginated);




export default router