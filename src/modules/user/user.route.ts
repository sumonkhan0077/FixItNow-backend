import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { userController } from "./user.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

router.post("/register", userController.registerUser )

router.get("/me",

auth(Role.ADMIN, Role.CUSTOMER, Role.TECHNICIAN),

userController.getMyProfile);



export const userRoutes = router;
