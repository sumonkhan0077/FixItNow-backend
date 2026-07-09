import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { bookingController } from "./booking.controller";

const router = Router();

router.post(
  "/Create",
  auth("CUSTOMER", "ADMIN"),
  bookingController.createBooking
);

router.patch(
  "/:id/cancel",
  auth("CUSTOMER", "ADMIN"),
  bookingController.cancelBooking
);

router.patch(
  "/update-status/:id",
  auth('TECHNICIAN', "ADMIN"),
  bookingController.updateBookingStatus
);

export const bookingRoutes = router;