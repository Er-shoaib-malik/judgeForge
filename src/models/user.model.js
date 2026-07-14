import mongoose ,{Schema} from "mongoose";

const userSchema = Schema(
    {
        name : {
            type : String, 
            required : true ,
        } ,
        username : {
            type : String ,
            required : true
        } ,
        email : {
            type : String ,
            required : true
        } ,
        password : {
            type : String ,
            required : true
        } ,
        rating : {
            type : String ,
        } ,
        role : {
            type : String ,
            default : "user"
        }

    },
    {
        timestamps : true 
    }
)

export const User = mongoose.model("User" , userSchema) ;