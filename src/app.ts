import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import config from "./config";
import cors from "cors";
import { notFound } from "./middlewares/notFound";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { authRoutes } from "./modules/auth/auth.route";
import { userRoutes } from "./modules/user/user.route";
import { technicianProfileRoutes } from "./modules/technicianProfile/technicianProfile.route";


const app : Application = express();

app.use(cors({
    origin: config.app_url,
    credentials: true,
}))

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())

app.get("/",(req : Request, res : Response) => {
    res.send("Hello, World!");
});


app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/technician-profile", technicianProfileRoutes )





app.use(notFound)

app.use(globalErrorHandler)


export default app;