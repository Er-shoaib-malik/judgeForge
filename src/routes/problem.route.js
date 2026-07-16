import { Router } from "express";
import { verifyJWT ,isAdmin} from "../middlewares/auth.middleware";

const router = Router() ;

router.use(verifyJWT)

router.route("/problems").get((req,res) => {res.send("problems fetch")})
router.route("/problems/:id").get((req,res)=>{res.send("problem fetch")})

router.route("/problems").post(isAdmin,(req,res)=>{res.send("Problem post")})
router.route("/problems").put(isAdmin,(req,res)=>{res.send("problem update")})
router.route("/problems").delete(isAdmin,(req,res)=>{res.send("problem delete")})

export default router ;