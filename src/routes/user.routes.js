import { Router } from "express";
import { registerUser ,loginUser, logoutUser,updatePassword, updateProfile,updateAvatar} from "../controllers/user.controller.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/multer.middleware.js"

const router = Router() ;


router.route("/register").post(registerUser)
router.route("/login").post(loginUser)

router.use(verifyJWT)
router.route("/logout").post(logoutUser)
router.route("/updatePassword").patch(updatePassword)
router.route("/updateProfile").patch(updateProfile)
router.route("/updateAvatar").patch(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }
    ]),updateAvatar)

export default router ;