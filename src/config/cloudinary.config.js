import dotenv from "dotenv"
dotenv.config({})
import { v2 as cloudinary } from 'cloudinary';


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
    secure: process.env.NODE_ENV === "development" ? false : true
});


export const testCloudinaryConnection = async () => {
    
    try {
        const result = await cloudinary.api.ping();
        console.log('Cloudinary connected successfully');
        return true;
    } catch (error) {
        console.error('Cloudinary connection failed:', error.message);
        return false;
    }
};

export default cloudinary;