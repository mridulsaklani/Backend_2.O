import blogCategoryModel from "../models/blogCategory.model";
import { BlogCategoryDocument } from "../types/models/blogCategories.type";
import { Projection, Session } from "../types/type.constants";
import baseRepository from "./base.repositories";

class BlogCategoryRepository extends baseRepository {
  constructor() {
    super(blogCategoryModel);
  }

  public findBySlug = async (slug: string, projection: Projection = "", session: Session = null):Promise<BlogCategoryDocument> => {
    return await this.model
      .findOne({ slug })
      .select(projection)
      .session(session);
  };
}

const blogCategoryRepository = new BlogCategoryRepository();

export default blogCategoryRepository;
