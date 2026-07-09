import { Router } from "express";
import { serviceController } from "./service.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

router.post(
  "/create",
  auth("TECHNICIAN", "ADMIN"),
  serviceController.createService,
);

router.get("/all", serviceController.getAllServices);

router.get(
  "/my-service",
  auth("TECHNICIAN", "ADMIN"),
  serviceController.getMyServices,
);

router.patch(
  "/:id",
  auth("TECHNICIAN", "ADMIN"),
  serviceController.updateService,
);

router.get("/:id", serviceController.getSingleService);

export const servicesRoutes = router;
