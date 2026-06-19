import blogSubCategoryService from "../services/blogSubCategory.service";
import { Controller } from "../types/type.constants";
import { apiResponse } from "../utils/apiResponse.utils";

class BlogSubCategoryController{
    private service: typeof blogSubCategoryService
    constructor(){
        this.service = blogSubCategoryService;
    }

    getAll: Controller = async(req, res, next)=>{
        try {
            const filters = {...req.query};
            const result = await this.service.getAll(filters);
            return res.status(200).json(new apiResponse(200, "All blog sub category fetched successfully", result))
        } catch (error) {
            next(error)
        }
    }

    create: Controller = async(req,res,next)=>{
        try {
            const userId = req.user._id;
            const payload = req.body;

            const result = await this.service.create(payload, userId);
            return res.status(201).json(new apiResponse(201, "Blog sub category created successfully", result))
        } catch (error) {
            next(error)
        }
    }

    update: Controller = async(req,res, next)=>{
        try {
            const payload = req.body;
            const {id} = req.params;
            const result = await this.service.update(id, payload);
            return res.status(200).json(new apiResponse(200, `${result.name} updated successfully`, result))
        } catch (error) {
            next(error)
        }
    }


    delete: Controller = async(req,res, next)=>{
        try {
            const {id} = req.params;
            const result = await this.service.delete(id);
            return res.status(200).json(new apiResponse(200, `${result.name} deleted successfully`, result))
        } catch (error) {
            next(error)
        }
    }
}

const blogSubCategoryController = new BlogSubCategoryController();

export default blogSubCategoryController

