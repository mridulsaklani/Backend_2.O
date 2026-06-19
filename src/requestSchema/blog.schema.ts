import { z } from "zod";
import { BLOG_STATUS } from "../constants/enums";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format");

const seoSchema = z
  .object({
    title: z
      .string()
      .max(60, "SEO title should be max 60 characters")
      .optional(),
    description: z
      .string()
      .max(160, "SEO description should be max 160 characters")
      .optional(),
    keywords: z
      .array(z.string().trim().min(1))
      .max(10, "Maximum 10 keywords allowed")
      .optional(),
  })
  .optional();

const commentSchema = z.object({
  user: objectIdSchema,
  comment: z
    .string()
    .trim()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment cannot exceed 1000 characters"),
  createdAt: z.date().optional(),
  likes: objectIdSchema.optional(),
});

const createBlogSchema = z.object({
  title: z
    .string({ message: "Title mist be required" })
    .trim()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title cannot exceed 100 characters"),

  shortDescription: z
    .string({ message: "Short description must be required" })
    .trim()
    .min(20, "Short description must be at least 20 characters")
    .max(200, "Short description cannot exceed 200 characters"),

  category: z
    .string({ message: "Category must be required" })
    .regex(/^[0-9a-fA-F]{24}$/, {
      message: "Invalid category ObjectId format.",
    }),

  subCategory: z
    .string({ message: "Sub Category must be required" })
    .regex(/^[0-9a-fA-F]{24}$/, {
      message: "Invalid sub category ObjectId format.",
    }),

  // slug: z.string()
  //     .trim()
  //     .min(1, "Slug is required")
  //     .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens only"),

  description: z
    .string()
    .trim()
    .min(80, "Description must be at least 80 characters"),

  seo: seoSchema,
});

const blogCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(55, "Title cannot exceed 55 characters"),
  description: z
    .string()
    .trim()
    .min(40, "Description must be at least 40 characters"),
});

const blogSubCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(55, "Title cannot exceed 55 characters"),
  category: z
    .string({ message: "Category must be required" })
    .regex(/^[0-9a-fA-F]{24}$/, {
      message: "Invalid category ObjectId format.",
    }),
  description: z
    .string()
    .trim()
    .min(40, "Description must be at least 40 characters"),
});

const updateBlogCategorySchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Title must be at least 3 characters")
      .max(55, "Title cannot exceed 55 characters"),

    description: z
      .string()
      .trim()
      .min(40, "Description must be at least 40 characters"),

    slug: z
      .string()
      .trim()
      .toLowerCase()
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug must be lowercase with hyphens only"
      ),
  })
  .refine((data) => Object.keys(data).length === 3, {
    message: "all field must be provided for update",
  });

const updateBlogSubCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(55, "Title cannot exceed 55 characters"),
  category: z
    .string({ message: "Category must be required" })
    .regex(/^[0-9a-fA-F]{24}$/, {
      message: "Invalid category ObjectId format.",
    }),
  description: z
    .string()
    .trim()
    .min(40, "Description must be at least 40 characters"),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase with hyphens only"
    ),
});

const bulkDeleteSchemaForBlogs = z.object({
  ids: z
    .array(objectIdSchema)
    .min(1, "At least one category must be selected for deletion"),
});

// DTOS

type createBlogDto = z.infer<typeof createBlogSchema>;
type createBlogCatDto = z.infer<typeof blogCategorySchema>;
type createBlogSubCatDto = z.infer<typeof blogSubCategorySchema>;
type updateBlogSubCatDto = z.infer<typeof updateBlogSubCategorySchema>;

export {
  createBlogSchema,
  blogCategorySchema,
  updateBlogCategorySchema,
  blogSubCategorySchema,
  bulkDeleteSchemaForBlogs,
  updateBlogSubCategorySchema,
  createBlogDto,
  createBlogCatDto,
  createBlogSubCatDto,
  updateBlogSubCatDto,
};
