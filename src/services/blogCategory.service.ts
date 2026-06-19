import { startSession } from "mongoose";
import generateSlug from "../utils/slug.utils";
import blogCategoryRepository from "../repositories/blogCategories.repository";
import { apiError } from "../utils/apiError.utils";
import { BLOG_STATUS, CATEGORY_STATUS } from "../constants/enums";
import { createBlogCatDto, createBlogDto } from "../requestSchema/blog.schema";
import { UserDocument } from "../types/models/user.type";
import { ResponsePromise, Sort } from "../types/type.constants";
import { BlogCategoryDocument } from "../types/models/blogCategories.type";
import {MongoServerError} from "mongodb"


class BlogCategoryService {
  private repository: typeof blogCategoryRepository
  constructor() {
    this.repository = blogCategoryRepository;
  }

  create = async (payload: createBlogCatDto, user: UserDocument): Promise<BlogCategoryDocument> => {
    const session = await startSession();
    try {
      session.startTransaction();

      const isExist = await this.repository.findOne(
        { name: payload.name },
        "",
        session
      );

      if (isExist) {
        throw new apiError(
          400,
          "Category already exist please use another name"
        );
      }

      const slug = await generateSlug(payload.name, this.repository, session);

      if (!slug) {
        throw new apiError(400, "Slug generation failed");
      }

      const response = await this.repository.create(
        { ...payload, slug, createdBy: user._id },
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

  getAll = async (filters:object ={}):Promise<Array<BlogCategoryDocument>> => {
    try {
      const sort: Sort = { createdAt: -1 };
      const response = await this.repository.getAll(filters, "", sort);

      if (!response) {
        throw new apiError(404, " failed to fetched all blog categories");
      }

      return response;
    } catch (error) {
      throw error;
    }
  };

  getAllforFrontend = async (filters:object = {}):Promise<Array<BlogCategoryDocument>> => {
    try {
      const combineFilters = { status: CATEGORY_STATUS.ACTIVE, ...filters };
      const sort: Sort = { createdAt: -1 };
      const result = await this.repository.getAll(combineFilters, "", sort);

      if (!result) {
        throw new apiError(404, " failed to fetched all frontend categories");
      }

      return result;
    } catch (error) {
      throw error;
    }
  };

  getBySlug = async (slug: string): Promise<BlogCategoryDocument> => {
    try {
      if (!slug) {
        throw new apiError(404, "Slug not found");
      }

      const response = await this.repository.findBySlug(slug);
      if (!response) {
        throw new apiError(404, "Blog Category not found for this Slug");
      }

      return response;
    } catch (error) {
      throw error;
    }
  };

  toggleStatus = async (id: string): Promise<BlogCategoryDocument> => {
    const session = await startSession();
    try {
      session.startTransaction();
      const category = await this.repository.findById(id, "", session);
      if (!category) {
        throw new apiError(404, "Category not found");
      }

      category.status =
        category.status === CATEGORY_STATUS.ACTIVE
          ? CATEGORY_STATUS.INACTIVE
          : CATEGORY_STATUS.ACTIVE;
      await category.save({ session });

      await session.commitTransaction();

      return category;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  };

  update = async (id: string, payload: createBlogCatDto):Promise<BlogCategoryDocument> => {
    const session = await startSession();
    try {
      session.startTransaction();

      const result = await this.repository.findById(id);

      if (!result) {
        throw new apiError(404, "Blog category not found");
      }

      // if(String(payload.slug).trim() !== String(result.slug).trim()){
      //  const newSlug = await generateSlug(payload.name, this.repository, session)
      //  payload.slug = newSlug
      // }

      const update = await this.repository.findByIdAndUpdate(
        id,
        payload,
        session
      );

      if (!update) {
        throw new apiError(400, `${result.name} sub category is not updated`);
      }

      await session.commitTransaction();

      return update;
    } catch (error:unknown) {
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

  delete = async(id: string)=>{
    const session = await startSession()
    try {
      session.startTransaction()
      const result = await this.repository.findById(id, "", session);
      if(!result){
        throw new apiError(404, "Blog category not found")
      }
      
      if(String(result.status).trim() === CATEGORY_STATUS.ACTIVE){
        throw new apiError(400, `${result.name} status is published so you can not delete it, please make it inactive first`)
      }

      const deletion = await this.repository.deleteOne({_id: id}, session);
      if(!deletion){
        throw new apiError(400, `${result.name} blog category not deleted `)
      }

      await session.commitTransaction()

      return deletion

    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      await session.endSession();
    }
  }

  bulkDelete = async(ids: Array<string>)=>{
    const session = await startSession();

    try {
      session.startTransaction()
      const findCat = await this.repository.find({_id: {$in: ids}}, "", )
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally{
      await session.endSession();
    }
  }
}

const blogCategoryService = new BlogCategoryService();

export default blogCategoryService;
