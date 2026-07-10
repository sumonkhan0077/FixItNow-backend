import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { reviewController } from "./review.controller";

const router = Router();

router.post(
  "/create",
  auth("CUSTOMER", "ADMIN"),
  reviewController.createReview
);

router.get(
  "/all",
  reviewController.getAllReviews
);

router.delete(
  "/delete/:id",
  auth("ADMIN"),
  reviewController.deleteReview
);

router.get(
  "/:id",
  reviewController.getSingleReview
);

export const reviewRoutes = router;