import { Router } from "express";
import { verifyJWT ,isAdmin} from "../middlewares/auth.middleware.js";
import { createProblem, deleteProblem, getAllProblems, getProblemById, updateProblem} from "../controllers/problem.controller.js";

const router = Router() ;

router.use(verifyJWT)

router.route("/").get(getAllProblems)
router.route("/:problemId").get(getProblemById)

router.use(isAdmin)

router.route("/").post(createProblem)
router.route("/:problemId").patch(updateProblem)
router.route("/:problemId").delete(deleteProblem)

export default router ;