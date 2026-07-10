import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { bookingController } from "./booking.controller";

const router = Router();

router.post(
  "/Create",
  auth("CUSTOMER", "ADMIN"),
  bookingController.createBooking
);


router.get(
  "/my-bookings",
  auth("CUSTOMER", "ADMIN"),
  bookingController.getMyBookings
);

router.get(
  "/technician-bookings",
  auth("TECHNICIAN", "ADMIN"),
  bookingController.getTechnicianBookings
);
router.get(
  "/all-bookings",
  auth("ADMIN"),
  bookingController.getAllBookings
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

router.get(
  "/:id",
  auth("CUSTOMER", "TECHNICIAN", "ADMIN"),
  bookingController.getSingleBooking
);



export const bookingRoutes = router;