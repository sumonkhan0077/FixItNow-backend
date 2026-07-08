import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { technicianProfileController } from "./technicianProfile.controller";

const router = Router();

router.post("/create",  auth("TECHNICIAN"),
  technicianProfileController.createTechnicianProfile )

  router.patch(
  "/update-profile",
  auth("TECHNICIAN"),
  technicianProfileController.updateTechnicianProfile
);



export const technicianProfileRoutes = router;