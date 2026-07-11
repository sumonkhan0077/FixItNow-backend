import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { userController } from "./user.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

router.post("/register", userController.registerUser )

router.get("/me",

auth(Role.ADMIN, Role.CUSTOMER, Role.TECHNICIAN),

userController.getMyProfile);

router.get(
  "/all-users",
  auth(Role.ADMIN),
  userController.getAllUsers
);

router.patch(
  "/status/:id",
  auth(Role.ADMIN),
  userController.updateUserStatus
);

router.patch(
  "/:id/role",
  auth(Role.ADMIN),
  userController.updateUserRole
);

export const userRoutes = router;
