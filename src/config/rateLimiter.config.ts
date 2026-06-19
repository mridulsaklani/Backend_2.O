import rateLimit, {
  RateLimitRequestHandler,
  ipKeyGenerator,
} from "express-rate-limit";
import { Request, Response } from "express";

class RateLimit {
  loginLimiter = (): RateLimitRequestHandler =>
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 5,
      message: {
        success: false,
        status: 429,
        message: "Too many login attempts. Please try again after 15 minutes",
      },
      keyGenerator: (req: Request, res: Response) => {
        return ipKeyGenerator(req, res);
      },
      standardHeaders: true,
      legacyHeaders: false,
    });

  globalRateLimit = (): RateLimitRequestHandler =>
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,

      message: {
        success: false,
        status: 429,
        message: "Too many requests, please try again later",
      },
      standardHeaders: true,
      legacyHeaders: false,
    });
}

const rateLimiter = new RateLimit();

export default rateLimiter;
