import { ZodError } from "zod";
import { apiError } from "../utils/apiError.utils";
import { REQUEST_SOURCE } from "../constants/enums";
import { Controller } from "../types/type.constants";
import { z } from "zod";

const validate = (
  schema: z.Schema,
  source = REQUEST_SOURCE.BODY
): Controller => {
  return (req, res, next) => {
    try {
      if (!Object.values(REQUEST_SOURCE).includes(source)) {
        return next(new apiError(400, `Invalid validation source: ${source}`));
      }

      let result;

      switch (source) {
        case REQUEST_SOURCE.BODY:
          result = schema.parse(req.body);
          req.body = result;
          break;
        case REQUEST_SOURCE.QUERY:
          result = schema.parse(req.query);
          Object.assign(req.query, result);
          break;
        case REQUEST_SOURCE.PARAMS:
          result = schema.parse(req.params);
          Object.assign(req.params, result);
          break;
        default:
          return next(
            new apiError(400, `Invalid validation source: ${source}`)
          );
      }

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(
          new apiError(
            422,
            "Validation failed",
            error.issues.map((err) => ({
              path: err.path.join("."),
              message: err.message,
              code: err.code,
            }))
          )
        );
      }

      return next(error);
    }
  };
};

export default validate;
