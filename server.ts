import dotenv from "dotenv"
dotenv.config({})


import connectMongo from "./src/config/mongodb"

import { testCloudinaryConnection } from "./src/config/cloudinary.config"

import app from "./src/app"


const PORT:number = Number(process.env.PORT) || 4000





connectMongo().then(async()=>{
     const cloudinaryConnected = await testCloudinaryConnection();
    
    if (!cloudinaryConnected) {
        console.log('Starting server without Cloudinary connection');
    }
   
    app.listen(PORT, ()=>console.log(`Server is starting on http://localhost:${PORT}`));
}).catch((err)=>{
    console.log('mongoDB connection error: ', err);
})
