import blogCategoryService from "../services/blogCategory.service";
import { apiError } from "../utils/apiError.utils";
import { apiResponse } from "../utils/apiResponse.utils";
import { Controller } from "../types/type.constants";

class BlogCategoryController {
  private controller: typeof blogCategoryService;

  constructor() {
    this.controller = blogCategoryService;
  }
  create: Controller = async (req, res, next) => {
    try {
      const payload = req.body;
      const user = req.user;
      const response = await this.controller.create(payload, user);
      return res
        .status(201)
        .json(new apiResponse(201, "Category created successfully", response));
    } catch (error) {
      next(error);
    }
  };

  getAll: Controller = async (req, res, next) => {
    try {
      const filters: object = req.query || {};
      const response = await this.controller.getAll(filters);
      if (response.length >= 0) {
        return res
          .status(200)
          .json(
            new apiResponse(
              200,
              "Blog Categories fetched, but not found matching blogs categories",
              response
            )
          );
      }
      return res
        .status(200)
        .json(
          new apiResponse(200, "Blog Categories fetched successfully", response)
        );
    } catch (error) {
      next(error);
    }
  };

  getAllforFrontend: Controller = async (req, res, next) => {
    try {
      const filters = req.query || {};
      const result = await this.controller.getAllforFrontend(filters);

      if (result.length >= 0) {
        return res
          .status(200)
          .json(
            new apiResponse(
              200,
              "Blog Categories fetched, but not found matching blogs categories",
              result
            )
          );
      }
      return res
        .status(200)
        .json(
          new apiResponse(200, "Blog Categories fetched successfully", result)
        );
    } catch (error) {
      next(error);
    }
  };

  getBySlug: Controller = async (req, res, next) => {
    try {
      const slug = req.params.slug;

      const result = await this.controller.getBySlug(slug);

      return res
        .status(200)
        .json(
          new apiResponse(
            200,
            "Blog Category fetched successfully with slug",
            result
          )
        );
    } catch (error) {
      next(error);
    }
  };

  toggleStatus: Controller = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await this.controller.toggleStatus(id);
      return res
        .status(200)
        .json(
          new apiResponse(
            200,
            `${result.name} status toggled to ${result.status} successfully`
          )
        );
    } catch (error) {
      next(error);
    }
  };

  update: Controller = async (req, res, next) => {
    try {
      const { id } = req.params;
      const payload = req.body;

      const result = await this.controller.update(id, payload);
      return res
        .status(200)
        .json(
          new apiResponse(200, `${result.name} updated successfully`, result)
        );
    } catch (error) {
      next(error);
    }
  };

  delete: Controller = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await this.controller.delete(id);
      return res
        .status(200)
        .json(
          new apiResponse(
            200,
            `${result.name} blog category deleted successfully`
          )
        );
    } catch (error) {
      next(error);
    }
  };

  bulkDelete: Controller = async (req, res, next) => {
    try {
      const payload = req.body;
      const result = await this.controller.bulkDelete(payload.ids);
      return res
        .status(200)
        .json(
          new apiResponse(
            200,
            "All selected blog categories deleted successfully"
          )
        );
    } catch (error) {
      next(error);
    }
  };
}

const blogCategoryController = new BlogCategoryController();

export default blogCategoryController;
