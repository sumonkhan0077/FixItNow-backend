import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import config from "./config";
import cors from "cors";
import { notFound } from "./middlewares/notFound";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { authRoutes } from "./modules/auth/auth.route";
import { userRoutes } from "./modules/user/user.route";
import { technicianProfileRoutes } from "./modules/technicianProfile/technicianProfile.route";
import { categoriesRoutes } from "./modules/category/category.route";
import { servicesRoutes } from "./modules/service/service.route";
import { bookingRoutes } from "./modules/booking/booking.route";
import { reviewRoutes } from "./modules/review/review.route";
import { availabilityRoutes } from "./modules/technicianAvailability/technicianAvailability.route";
import { paymentRouts } from "./modules/payment/payment.route";
import { paymentController } from "./modules/payment/payment.controller";


const app : Application = express();

app.use(cors({
    origin: config.app_url,
    credentials: true,
}))


app.post(
  "/api/payments/confirm",
  express.raw({ type: "application/json" }),
  paymentController.handleWebhook,
);


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())

app.get("/",(req : Request, res : Response) => {
    res.send("Hello, World!");
});


app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/technician-profile", technicianProfileRoutes)
app.use("/api/categories", categoriesRoutes)
app.use("/api/services", servicesRoutes)
app.use("/api/bookings", bookingRoutes)
app.use("/api/reviews", reviewRoutes)
app.use("/api/payments", paymentRouts)




app.use(notFound)

app.use(globalErrorHandler)


export default app;