import { Router } from "express";
import { verifyJWT ,isAdmin} from "../middlewares/auth.middleware.js";
import {addTestCase, deleteTestCase, getProblemTestCases, updateTestCase} from "../controllers/testcase.controller.js"

const router = Router() ;

router.use(verifyJWT)
router.use(isAdmin)

router.route("/:problemId/testcases").post(addTestCase)
router.route("/:problemId/testcases").get(getProblemTestCases)
router.route("/:testcaseId").patch(updateTestCase)
router.route("/:testcaseId").delete(deleteTestCase)

export default router ;
