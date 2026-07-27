import { Router } from "express";
import { verifyJWT ,isAdmin} from "../middlewares/auth.middleware.js";
import { createSubmission, problemSubmissions, userSubmissions } from "../controllers/submission.controller.js";

const router = Router() ;

router.use(verifyJWT)

router.route("/:problemId/submit").post(createSubmission)
router.route("/submissions").get(userSubmissions)
router.route("/:problemId/submissions").get(problemSubmissions)

export default router ;
