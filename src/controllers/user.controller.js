import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {User} from "../models/user.model.js"
import mongoose from "mongoose";

const options = {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
};

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
        throw new ApiError(409 , "user with username or email already exists")
    }

    const user = await User.create({
        fullName ,
        email ,
        password ,
        username :username.toLowerCase() 
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    
    if(!createdUser){
        throw new ApiError(500 , "Something is wrong while registering a user")
    }

    return res.status(201).json(
        new ApiResponse(201 , createdUser, "User is registered successfully")
    )

})

const loginUser = asyncHandler(async (req,res) => {
    const {username , email , password} = req?.body

    if(!username && !email){
        throw new ApiError(400 , "username or email is required")
    }

    if(!password){
        throw new ApiError(400 , "Password is required")
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

    const validated = await user.isPasswordCorrect(password)

    if(!validated){
        throw new ApiError(401 , "Password is incorrect")
    }

    const {accessToken ,refreshToken} = await generateAccessAndRefreshToken(user._id)
    
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken") ;

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken" ,refreshToken, options)
    .json(
        new ApiResponse(
            200,
            user,
            "User logged In Successfully"
        )
    )
})

const logoutUser = asyncHandler(async (req,res) => {
    await User.findByIdAndUpdate(req.user._id ,
    {
        $set : {
            refreshToken : ""
        }
    },
    {
        new : true
    }
    )

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(200 , "user logged out")
    )
})

const updatePassword = asyncHandler(async (req,res)=>{
    const {oldPassword,newPassword} = req.body
    const id = req.user._id

    if(!oldPassword || !newPassword){
        throw new ApiError(400,"All fields are required")
    }

    const user = await User.findById(id) ;

    const isvalidated = await user.isPasswordCorrect(oldPassword)

    if(!isvalidated){
        throw new ApiError(403, "Old password is incorrect")
    }

    user.password = newPassword ;
    await user.save() ;

    return res
    .status(201)
    .json(
        new ApiResponse(201,"password updated succeddfully")
    )

})

const updateProfile = asyncHandler(async(req,res)=>{
    //only fullName bio
    const {fullName ,bio} = req.body

    if(!fullName){
        throw new ApiError(400, "full Name can not be empty")
    }

    if(bio && bio.length > 100){
        throw new ApiError(400, "bio characters should be less than 100 ")
    }

    const user = await User.findByIdAndUpdate(req.user._id ,
        {
            $set : {
                fullName,
                bio
            }
        },
        {
            new : true
        }
    ).select("-password -refreshToken")

    return res
    .status(200)
    .json(
        new ApiResponse(200,user, "Profile updated Successfully")
    )
})

const updateAvatar = asyncHandler(async (req,res) => {
    const avatarLocalPath = req.files?.avatar?.[0]?.path

    if(!avatarLocalPath){
        throw new ApiError(400, "avatar is required")
    }

    await deleteFromCloudinary(req.user.avatarPublicId) ;

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if(!avatar || !avatar.url){
        throw new ApiError(500 ,"Error while uploading avatar")
    }

    const user = await User.findByIdAndUpdate(req.user._id, 
        {
            $set : {
                avatar : avatar.secure_url ,
                avatarPublicId : avatar.public_id
            }
        },
        {
            new : true
        }
    ).select("-password -refreshToken")

    return res
    .status(200)
    .json(
        new ApiResponse(200 ,user, "avatar udpated successfully")
    )
})

export {registerUser ,loginUser, logoutUser,updatePassword , updateProfile , updateAvatar} 