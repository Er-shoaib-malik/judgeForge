import { Router } from "express";
import { verifyJWT ,isAdmin} from "../middlewares/auth.middleware.js";
import { createSubmission, problemSubmissions, userSubmissions ,runCode,getSubmission } from "../controllers/submission.controller.js";

const router = Router() ;

router.use(verifyJWT)

router.route("/:problemId/submit").post(createSubmission)
router.route("/Allsubmissions").get(userSubmissions)
router.route("/problems/:problemId/submissions").get(problemSubmissions)
router.route("/:problemId/run").post(runCode) ;
router.route("/:submissionId").get(getSubmission)

export default router ;
