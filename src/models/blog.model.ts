import { model, Schema, Types } from "mongoose";
import { BLOG_STATUS } from "../constants/enums";

import { BlogDocument } from "../types/models/blog.type";

const blogModel = new Schema<BlogDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      match: [
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug must be lowercase with hyphens only",
      ]
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "BlogCategory",
      required: true,
    },
    subCategory: {
      type: Schema.Types.ObjectId,
      ref: "BlogSubCategory",
      required: true,
    },
    coverImage: {
      image: {
        type: String,
        default: null,
      },
      key: {
        type: String,
        default: null,
      },
    },
    status: {
      type: String,
      enum: Object.values(BLOG_STATUS),
      default: BLOG_STATUS.PUBLISHED,
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        comment: {
          type: String,
          maxLength: 1000,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        likes: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    seo: {
      title: String,
      description: String,
      keywords: { type: [String], default: [] }
    },
  },
  { timestamps: true }
);


blogModel.methods.manageLike = async function (userId: string) {
  const likeIndex = this.likes
    .map((id: Types.ObjectId) => id.toString())
    .indexOf(userId);

  if (likeIndex > -1) {
    this.likes.splice(likeIndex, 1);
    return { action: "unliked", totalLikes: this.likes.length };
  } else {
    this.likes.push(new Types.ObjectId(userId));
    return { action: "liked", totalLikes: this.likes.length };
  }
};

export default model("Blog", blogModel);
