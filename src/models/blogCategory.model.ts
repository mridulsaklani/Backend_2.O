import { model,  Schema, Types } from "mongoose";
import { CATEGORY_STATUS } from "../constants/enums";
import { BlogCategoryDocument } from "../types/models/blogCategories.type";

const blogCategoryModel = new Schema<BlogCategoryDocument>({
    name: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        trim: true,
        required: true,
        lowercase: true,
        unique: true,
        match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/,"Slug must be lowercase with hyphens only"]
    },
    description: {
        type: String,
        trim: true,
        required: true,
    },
    createdBy: {
        type:   Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: Object.values(CATEGORY_STATUS),
        default: CATEGORY_STATUS.ACTIVE,
        
    }

}, {timestamps: true})

export default model("BlogCategory", blogCategoryModel)