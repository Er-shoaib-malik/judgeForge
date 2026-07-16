import { Router } from "express";
import { registerUser ,loginUser, logoutUser} from "../controllers/user.controller.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router() ;


router.route("/register").post(registerUser)
router.route("/login").post(loginUser)

router.use(verifyJWT)
router.route("/logout").post(logoutUser) ;

router.route("/problem").get((req,res) => {res.send("problems fetch")})
router.route("/problem/:id").get((req,res)=>{res.send("problem fetch")})

router.route("/problem").post(isAdmin,(req,res)=>{res.send("Problem post")})
router.route("/problem").put(isAdmin,(req,res)=>{res.send("problem update")})
router.route("/problem").delete(isAdmin,(req,res)=>{res.send("problem delete")})

export default router ;