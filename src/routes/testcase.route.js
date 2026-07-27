import { Router } from "express";
import { verifyJWT ,isAdmin} from "../middlewares/auth.middleware.js";
import {addTestCase} from "../controllers/testcase.controller.js"

const router = Router() ;

router.use(verifyJWT)
router.use(isAdmin)

router.route("/:problemId/testcase").post(addTestCase)

export default router ;
