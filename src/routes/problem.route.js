import { Router } from "express";
import { verifyJWT ,isAdmin} from "../middlewares/auth.middleware.js";
import { createProblem, deleteProblem, getAllProblems, getProblemById, updateProblem, submitProblem, addTestCases } from "../controllers/problem.controller.js";

const router = Router() ;

router.use(verifyJWT)

router.route("/").get(getAllProblems)
router.route("/:problemId").get(getProblemById)
router.route("/:problemId/submit").post(submitProblem)

router.use(isAdmin)

router.route("/").post(createProblem)
router.route("/:problemId").patch(updateProblem)
router.route("/:problemId").delete(deleteProblem)
router.route("/:problemId/testcase").post(addTestCases)

export default router ;