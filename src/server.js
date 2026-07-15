import dotenv from "dotenv"
import express from "express"
import app from "./app.js"
import connectDB from "./config/db.js";

dotenv.config({
    path: './.env'
});
const PORT = process.env.PORT || 8000

connectDB()
.then(()=>{
    app.listen(8000 , (req,res)=>{
        console.log("Server is running : " , "http://localhost:8000") ;
    })
}
)
.catch((error)=>{
    console.log(error) ;
}
)

