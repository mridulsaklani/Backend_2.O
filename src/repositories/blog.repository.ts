import baseRepository from "./base.repositories";
import blogModel from "../models/blog.model";
import { Projection, Session } from "../types/type.constants";
import {Model} from "mongoose"
import { BlogCategoryDocument } from "../types/models/blogCategories.type";



class BlogRepositories extends baseRepository {
    constructor(){
        super(blogModel)
    }
   protected findBySlug = async(slug: string, projection: Projection, session: Session):Promise<BlogCategoryDocument>=>{
       return await this.model.findOne({slug}).select(projection).session(session)
    }
}

const blogRepositories = new BlogRepositories();
export default blogRepositories 