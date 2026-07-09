import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { reviewController } from "./review.controller";

const router = Router();

router.post(
  "/create",
  auth("CUSTOMER", "ADMIN"),
  reviewController.createReview
);

export const reviewRoutes = router;