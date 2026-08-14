import { Router } from "express";
import { verifyJWT ,isAdmin} from "../middlewares/auth.middleware.js";
import {addTestCase, deleteTestCase, getProblemTestCases, updateTestCase,addBulkTestCase} from "../controllers/testcase.controller.js"

const router = Router() ;

router.use(verifyJWT)

router.route("/:problemId/gettestcases").get(getProblemTestCases)

router.use(isAdmin)

router.post("/bulk",addBulkTestCase);

router.route("/:problemId/create-testcases").post(addTestCase)
router.route("/:testcaseId").patch(updateTestCase)
router.route("/:testcaseId").delete(deleteTestCase)

export default router ;
