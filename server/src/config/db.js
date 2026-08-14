import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async (req,res)=>{
    try {
        const connect = await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "code_judge",
        });
        console.log(`✅ DataBase Connected !! Host : ${connect.connection.host}`) ;

    } catch (error) {
        console.log(error) ;
        process.exit(1) ;
    }
}

export default connectDB ;