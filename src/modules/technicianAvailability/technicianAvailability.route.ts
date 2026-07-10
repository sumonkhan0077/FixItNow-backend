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


export const availabilityRoutes = router;
