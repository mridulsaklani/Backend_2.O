
import express, { json, urlencoded } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/errorHandler.middleware";

import rateLimiter from "./config/rateLimiter.config";

const app = express();
const origin: string = process.env.CLIENT_URL || "";

// PLUGIN MIDDLEWARES
app.use(cors({
    origin,
    credentials: true,
    methods:["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders:["Content-Type", "Authorization"]
}));



app.use(rateLimiter.globalRateLimit());
app.use(helmet({
    contentSecurityPolicy: true,
    crossOriginResourcePolicy: true
}
))
app.use(morgan("dev"));
app.use(urlencoded({extended: true}));
app.use(cookieParser());
app.use(json());

app.use(errorHandler);

console.log(globalThis)

// IMPORT ROUTES 

import authRouter from "./routes/auth.routes";
import blogRouter from "./routes/blog.route";
import blogCategoryRouter from "./routes/blogCategory.routes"
import blogSubCategoryRouter from "./routes/blogSubCategory.route"
import { boolean } from "zod";


app.use("/api/auth", authRouter);
app.use("/api/blog", blogRouter);
app.use("/api/blog-category", blogCategoryRouter);
app.use("/api/blog-sub-category", blogSubCategoryRouter);


// RESPONSE MIDDLEWARES

app.use(errorHandler);


app.get("/",(req,res)=>{
    res.send("Jai sri raam")
})

export default app