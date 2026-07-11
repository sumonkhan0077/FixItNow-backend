import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { paymentController } from "./payment.controller";


const router = Router();

router.post(
  "/create-checkout-session/:bookingId",
  auth(Role.CUSTOMER, Role.ADMIN),
  paymentController.createCheckoutSession
);



router.get("/", auth(Role.CUSTOMER,  Role.ADMIN), paymentController.getPaymentHistory);

router.get("/:id", auth(Role.CUSTOMER, Role.ADMIN), paymentController.getPaymentDetails);

export const paymentRouts = router;