import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { availabilityController } from "./technicianAvailability.controller";

const router = Router()

router.post(
  "/create",
  auth(Role.TECHNICIAN , Role.ADMIN),
  availabilityController.createAvailability
);

router.get(
  "/my-slots",
  auth(Role.TECHNICIAN, Role.ADMIN),
  availabilityController.getMyAvailability
);

router.patch(
  "/update-slot/:id",
  auth(Role.TECHNICIAN, Role.ADMIN),
  availabilityController.updateAvailability
);

router.delete(
  "/:id",
  auth(Role.TECHNICIAN, Role.ADMIN),
  availabilityController.deleteAvailability
);


export const availabilityRoutes = router;
