import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

const verifyJWT = asyncHandler(async (req,_,next) => {
    try {
            const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
            if(!token){
                throw new ApiError(401, "Unauthorized User")
            }
        
            const decoded = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)
        
            const user = await User.findById(decoded?._id).select("-password -refreshToken").lean()
        
            if(!user){
                throw new ApiError(401 , "invalid access token")
            }
        
            req.user = user
            next()
    } catch (error) {
        throw new ApiError(401 , error?.message || "Invalid Access Token")
    }
})


const isAdmin = asyncHandler(async (req,res,next) => {
    if(!req.user){
        throw new ApiError(401, "Unauthorised User")
    }

    if(req.user.role !== "admin"){
        throw new ApiError(403, "Access denied . Admins only")
    }

    next()
})

export {verifyJWT , isAdmin}