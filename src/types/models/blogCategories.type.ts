import { Document, Types } from "mongoose";

export interface BlogCategoryDocument extends Document {
    name:string;
    slug:string;
    description: string;
    createdBy: Types.ObjectId;
    status: string;
}