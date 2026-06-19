import blogService from "../services/blog.service";
import { apiResponse } from "../utils/apiResponse.utils";
import { Controller } from "../types/type.constants";

class BlogController {
  create: Controller = async (req, res, next) => {
    try {
      const payload = req.body;
      const image = req.file ? req.file.path : null;
      const user = req.user;
      const response = await blogService.create(payload, user, image);
      return res
        .status(201)
        .json(new apiResponse(201, "Blog Created Successfully", response));
    } catch (error) {
      next(error);
    }
  };

  getAllPaginated: Controller = async (req, res, next) => {
    try {
      const { page = 1, limit = 10, ...filters } = req.query;
      const blogs = await blogService.getAllPaginated(+page, +limit, filters);
      return res
        .status(200)
        .json(new apiResponse(200, "All blog fetch successfully", blogs));
    } catch (error) {
      next(error);
    }
  };
}

const blogController = new BlogController();

export default blogController;
