import { Router } from "express";
import { registerUser ,loginUser,currentUser, logoutUser,updatePassword, updateProfile,updateAvatar} from "../controllers/user.controller.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/multer.middleware.js"

const router = Router() ;


router.route("/register").post(registerUser)
router.route("/login").post(loginUser)

router.use(verifyJWT)
router.route("/current-user").get(currentUser)
router.route("/logout").post(logoutUser)
router.route("/update-password").patch(updatePassword)
router.route("/update-profile").patch(updateProfile)
router.route("/update-avatar").patch(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }
    ]),updateAvatar)

export default router ;