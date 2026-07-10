import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { technicianProfileController } from "./technicianProfile.controller";

const router = Router();

router.post("/create",  auth("TECHNICIAN", "ADMIN"),
  technicianProfileController.createTechnicianProfile )

  router.patch(
  "/update-profile",
  auth("TECHNICIAN", "ADMIN"),
  technicianProfileController.updateTechnicianProfile
);

router.get(
  "/my-profile",
  auth("TECHNICIAN", "ADMIN"),
  technicianProfileController.getMyTechnicianProfile
);

router.get(
  "/all",
  auth("ADMIN"),
  technicianProfileController.getAllTechnicianProfiles
);

// // Single Technician Profile
// router.get(
//   "/:id",
//   auth("CUSTOMER", "TECHNICIAN", "ADMIN"),
//   technicianProfileController.getSingleTechnicianProfile
// );



export const technicianProfileRoutes = router;