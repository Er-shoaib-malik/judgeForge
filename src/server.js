import express from "express"

const app = express() ;

app.get("/" ,(req,res)=>{
    res.send("Hello Jii") ;
})

app.listen(8000 , (req,res)=>{
    console.log("Server is running : " , "http://localhost:8000") ;
})