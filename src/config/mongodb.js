import mongoose from "mongoose"


const connectMongo = async()=>{
    try {
        const connect = await mongoose.connect(process.env.MONGODB_URI);
        console.log('Mongodb connected successfully: ', connect.connection.host)
    } catch (error) {
        console.error("mongoDB connection error: ", error )
        process.exit(1)
    }


}

export default connectMongo