import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {User} from "../models/user.model.js"

const options = {
    httpOnly : true ,
    secure : true
}

const generateAccessAndRefreshToken = async (userid) =>{
    try {
        const user = await User.findById(userid)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave : false})

        return {accessToken, refreshToken}
    } catch (error) {
        console.log(error);
        
        throw new ApiError(500 , "Something went wrong while generating access and refresh token")
    }
}

const registerUser = asyncHandler(async (req,res) => {
    const {fullName , email , password ,username} = req.body || {}

    if(
        [fullName , email , password , username].some((field) => !field  || field.trim() === "")
    ){
        throw new ApiError(400, "All fields required")
    }

    const existedUser = await User.findOne({
        $or : [{username} , {email}]
    })

    if(existedUser){
        throw new ApiError(400 , "user with username or email already exists")
    }

    const user = User.create({
        fullName ,
        email ,
        password ,
        username :username.toLowerCase() 
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    
    if(createdUser){
        throw new ApiError(500 , "Something is wrong while registering a user")
    }

    return res.status(201).json(
        new ApiResponse(200 , createdUser, "User is registered successfully")
    )

})

const loginUser = asyncHandler(async (req,res) => {
    const {username , email , password} = req.body || {}

    if(!username && !email){
        throw new ApiError(400 , "username or email is required")
    }

    const user = await User.findOne({
        $or: [
            { username: username?.toLowerCase().trim() },
            { email: email?.toLowerCase().trim() }
        ]
    });

    if(!user){
        throw new ApiError(404 , "user with username or email doesn't exists")
    }

    if(!password){
        throw new ApiError(400 , "Password is required")
    }

    const validated = await user.isPasswordCorrect(password)

    if(!validated){
        throw new ApiError(401 , "Password is incorrect")
    }

    const {accessToken ,refreshToken} = await generateAccessAndRefreshToken(user._id)
    
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken") ;

    res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken" ,refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user : loggedInUser, accessToken ,refreshToken
            },
            "User logged In Successfully"
        )
    )
})

export {registerUser ,loginUser} 