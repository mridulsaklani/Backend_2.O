import { startSession, Types } from "mongoose";
import BlogSubCategoryRepository from "../repositories/blogSubCategory.repository";
import generateSlug from "../utils/slug.utils";
import {
  createBlogSubCatDto,
  updateBlogSubCatDto,
} from "../requestSchema/blog.schema";
import { apiError } from "../utils/apiError.utils";
import { BlogCategoryDocument } from "../types/models/blogCategories.type";
import { BlogSubCategoryDocument } from "../types/models/blogSubCategories.type";
import { MongoServerError } from "mongodb";
import { Filters, Sort } from "../types/type.constants";

const blogSubCategoryRepository = new BlogSubCategoryRepository();

class BlogSubCategoryService {
  protected repository: typeof blogSubCategoryRepository;
  constructor() {
    this.repository = blogSubCategoryRepository;
  }

  getAll = async(filters: Filters): Promise<Array<BlogSubCategoryDocument>>=>{
      try {
        const query:{[key: string]: any} = {}
        if(filters.name){
            query.name = filters.name
        }
        if(filters.slug){
            query.slug = filters.slug
        }
        if(filters.categories){
          const categories =   Array.isArray(filters.categories) ? filters.categories : [filters.categories]

          query.categories = {$in: categories}
            
        }
        const sort:Sort = {createdAt: -1}

        const result = await this.repository.find(query,"", sort)
        if(!result){
            throw new apiError(404, "Blog sub categories not found")
        }

        return result
      } catch (error) {
        throw error
      }
  }

  create = async (
    payload: createBlogSubCatDto,
    userId: string
  ): Promise<BlogSubCategoryDocument> => {
    const session = await startSession();
    try {
      session.startTransaction();

      const isExistWithName = await this.repository.findOne(
        { name: payload.name },
        "",
        session
      );
      if (isExistWithName) {
        throw new apiError(
          400,
          "Sub Category already exist please use another name"
        );
      }

      const slug = await generateSlug(payload.name, this.repository, session);
      if (!slug) {
        throw new apiError(400, "Slug generation failed");
      }

      const response = await this.repository.create(
        { ...payload, slug, createdBy: userId },
        session
      );

      if (!response) {
        throw new apiError(400, "Blog category not created");
      }

      await session.commitTransaction();
      return response;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  };

  update = async (
    id: string,
    payload: updateBlogSubCatDto
  ): Promise<BlogSubCategoryDocument> => {
    const session = await startSession();
    try {
      session.startTransaction();

      if(!Types.ObjectId.isValid(id)){
         throw new apiError(400, "Invalid object id formate")
      }

      const isExist = await this.repository.findById(id, "", session);
      if (!isExist) {
        throw new apiError(404, "Sub category not found");
      }

      // const isSlugExist = await this.repository.findBySlug(payload.slug, "", session)
      // if(isSlugExist){
      //     throw new apiError(400, `${payload.slug} slug is exist please use different`)
      // }

      const update = await this.repository.findByIdAndUpdate(
        id,
        payload,
        session
      );

      if (!update) {
        throw new apiError(400, "Blog sub category not updated");
      }

      await session.commitTransaction();
      return update;
    } catch (error) {
      await session.abortTransaction();
      if (error instanceof MongoServerError && error.code === 11000) {
        const duplicateKey = Object.keys(error.keyValue || {})[0];
        const duplicateValue = Object.values(error.keyValue || {})[0];
        throw new apiError(
          409,
          `Duplicate value for "${duplicateKey}" (${duplicateValue}), please use a different one.`,
          error
        );
      }
      throw error;
    } finally {
      await session.endSession();
    }
  };

  delete = async(id: string): Promise<BlogSubCategoryDocument>=>{
    try {
         if(!Types.ObjectId.isValid(id)){
         throw new apiError(400, "Invalid object id formate")
      }

      const result = await this.repository.deleteOne({_id: id})
      if(!result){
        throw new apiError(400, "Blog sub category not found, my be deleted bc")
      }
      return result
    } catch (error) {
        throw error
    }
  }

  bulkDelete = async(ids: Array<string>)=>{
    try {
        for (let id in ids){
            if(Types.ObjectId.isValid(id)){
                throw new apiError(400, "Invalid Object Id")
            }
        }
    } catch (error) {
        throw error
    }
  }
}

const blogSubCategoryService = new BlogSubCategoryService();
export default blogSubCategoryService;
