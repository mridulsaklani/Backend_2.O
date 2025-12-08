import baseRepository from "./base.repositories";
import blogSubCategoryModel from "../models/blogSubCategory.model";
import { Projection, Session } from "../types/type.constants";
import { BlogSubCategoryDocument } from "../types/models/blogSubCategories.type";


class BlogSubCategoryRepository extends baseRepository{
    constructor(){
       super(blogSubCategoryModel)
    }

    public findBySlug = async (slug: string, projection: Projection = "", session: Session = null): Promise<BlogSubCategoryDocument> => {
    return await this.model
      .findOne({ slug })
      .select(projection)
      .session(session);
  };
}

export default BlogSubCategoryRepository


