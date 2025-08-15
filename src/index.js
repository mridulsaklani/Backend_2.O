import dotenv from "dotenv"
dotenv.config({})
import express, { json, urlencoded } from "express"
import cors from "cors"
import morgan from "morgan"
import connectMongo from "../src/config/mongodb.js"
import cookieParser from "cookie-parser"
const PORT = process.env.PORT || 4000
const app = express()


// PLUGIN MIDDLEWARES
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods:["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders:["Content-Type", "Authorization"]
}))
app.use(morgan("dev"))
app.use(urlencoded({extended: true}))
app.use(cookieParser())
app.use(json())


app.get('/',(req,res)=>{
    res.send("Jai sri ram")
})

connectMongo().then(()=>{
    app.listen(PORT, ()=>console.log(`Server is starting on http://localhost:${PORT}`));
}).catch((err)=>{
    console.log('mongoDB connection error: ', err);
})
