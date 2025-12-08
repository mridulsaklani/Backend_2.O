import { startSession } from "mongoose";
import generateSlug from "../utils/slug.utils";
import blogRepositories from "../repositories/blog.repository";
import { simpleImage } from "../utils/cloudinary.utils";
import { apiError } from "../utils/apiError.utils";
import { createBlogDto } from "../requestSchema/blog.schema";
import { UserDocument } from "../types/models/user.type";
import { Data, Filters } from "../types/type.constants";

class BlogService {
  create = async (payload: createBlogDto, user: UserDocument, img: any) => {
    const session = await startSession();
    try {
      session.startTransaction();

      const slug = await generateSlug(payload.title, blogRepositories, session);
      if (!slug) {
        throw new apiError(400, "Slug generation failed");
      }
      let result;
      if (img) {
        result = await simpleImage(img);
      }

      const response = await blogRepositories.create(
        {
          ...payload,
          slug,
          author: user._id,
          coverImage: {
            image: result ? result.url : null,
            key: result ? result.key : null,
          },
        },
        session
      );

      if (!response) {
        throw new apiError(400, "Blog not created");
      }

      await session.commitTransaction();
      return response;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  };

  getAllPaginated = async (page = 1, limit = 10, filters: Filters) => {
    try {
      const query: Data = {};

      if (filters.category) {
        query.category = filters.category;
      }

      if (filters.author) {
        query.author = filters.author;
      }

      const blogs = await blogRepositories.paginated(page, limit, query, {
        createdAt: -1,
      });

      if (!blogs) {
        throw new apiError(404, "Blogs not fetched");
      }

      return blogs;
    } catch (error) {
      throw error;
    }
  };
}

const blogService = new BlogService();

export default blogService;
