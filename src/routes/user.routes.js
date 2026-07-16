import { Router } from "express";
import { registerUser ,loginUser, logoutUser} from "../controllers/user.controller.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router() ;


router.route("/register").post(registerUser)
router.route("/login").post(loginUser)

router.use(verifyJWT)
router.route("/logout").post(logoutUser) ;

export default router ;