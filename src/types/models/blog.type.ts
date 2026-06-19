import {Document, Types} from "mongoose"

export interface BlogDocument extends Document{
    title: string;
    shortDescription: string;
    slug: string;
    description: string;
    author: Types.ObjectId;
    category: Types.ObjectId;
    subCategory: Types.ObjectId;
    coverImage: ImageType;
    status: string;
    views: number;
    likes: Types.ObjectId[],
    comments: Comment[],
    seo: SEO

}