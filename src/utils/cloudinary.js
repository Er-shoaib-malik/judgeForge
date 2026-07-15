import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME ,
    api_key : process.env.CLOUDINARY_API_KEY ,
    api_secret : process.env.CLOUDINARY_SECRET_KEY
})

const uploadOnCloudinary = async (LocalFilePath)=>{
    try {
        if(!LocalFilePath) return null ;

        const response = await cloudinary.uploader.upload(LocalFilePath ,{
            resource_type : "auto" // auto detect file type
        })

        fs.unlinkSync(
            LocalFilePath //unkink file from server
        ) ;

        return response 
    } catch (error) {
        fs.unlinkSync(LocalFilePath)
        console.log(error)
        return null
    }
}

export {uploadOnCloudinary}