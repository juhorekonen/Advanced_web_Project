import express, { Express, Request, Response } from "express"
import path from "path"
// import passport from "passport"
import router from "./src/routes/index"
import userRouter from "./src/routes/user"
import morgan from "morgan"
import mongoose, { Connection } from "mongoose"
import dotenv from "dotenv"
import cors, { CorsOptions } from "cors"

dotenv.config()

const app: Express = express()
const port: number = parseInt(process.env.PORT as string) || 1234

const mongoDB: string = "mongodb://127.0.0.1:27017/FullStackDB"
mongoose.connect(mongoDB)
mongoose.Promise = Promise
const db: Connection = mongoose.connection

db.on("error", console.error.bind(console, "MongoDB connection error"))

if (process.env.NODE_ENV === "development") {
    const corsOptions: CorsOptions = {
        origin: "http://localhost:3000",
        optionsSuccessStatus: 200
    }
    app.use(cors(corsOptions))
} else if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.resolve("../..", "client", "build")))
    app.get("*", (req: Request, res: Response) => {
        res.sendFile(path.resolve("../..", "client", "build", "index.html"))
    })
}

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(morgan("dev"))

// For some reason my userRouter "/user" didn't work when using the settings given in week 12 lecture, so
// I had to change "/api/" to everywhere. 
// So now both routes use the same route, but are located in separate files
app.use("/", router)
app.use("/", userRouter)

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
