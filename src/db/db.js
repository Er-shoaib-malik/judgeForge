import mongoose from "mongoose";
import { DB_NAME } from "../constants";

const connectDB = async (req,res)=>{
    try {
        const connect = await mongoose.connect(`${proccess.env.MONGODB_URI}/${DB_NAME}`) ;
        console.log(`✅ DataBase Connected !! Host : ${connect.connection.host}`) ;

    } catch (error) {
        console.log(error) ;
        proccess.exit(1) ;
    }
}

export default connectDB