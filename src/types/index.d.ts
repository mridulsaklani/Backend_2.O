import "express";
import UserModel from "../models/user.model";
import {Types} from "mongoose"

declare global {
  namespace Express {
    interface Request {
      user?: UserModel;
    }
  }

  interface ImageType {
    image: string;
    key: string;
  }

  interface Comment {
    user: Types.ObjectId;
    comment: string;
    createdAt: Types.ObjectId;
    likes: string
  }

  interface SEO {
    title: string;
    description: string;
    keywords: string[]
  }
  
}
