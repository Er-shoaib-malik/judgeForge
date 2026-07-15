import { Router } from "express";

const router = Router() ;

router.route("/login").get(
    (req,res)=>{
        res.send("Login Route")
    }
)

export default router