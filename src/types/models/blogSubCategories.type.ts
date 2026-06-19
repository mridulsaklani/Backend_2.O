import { Document, Types } from "mongoose";



export interface BlogSubCategoryDocument extends Document{
    name: string;
    category: Types.ObjectId;
    slug: string;
    description: string;
    createdBy: Types.ObjectId;
    status: string
}