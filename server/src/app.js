import cookieParser from "cookie-parser"
import express from "express"
import cors from "cors"
import userRoutes from "./routes/user.routes.js"
import problemRoutes from "./routes/problem.route.js"
import submissionRoutes from "./routes/submission.route.js"
import testCaseRoutes from "./routes/testcase.route.js"
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express() ;

app.use(cors(
    {
        origin : process.env.CORS_ORIGIN ,
        credentials : true
    }
))
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended : true , limit: "10mb"}))
app.use(express.static("public"))
app.use(cookieParser())

app.use("/users", userRoutes)
app.use("/problems",problemRoutes)
app.use("/submissions",submissionRoutes)
app.use("/testcases",testCaseRoutes)

app.use(errorHandler)

export default app ;