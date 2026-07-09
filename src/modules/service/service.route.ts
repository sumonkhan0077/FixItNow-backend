import { Router } from "express";
import { serviceController } from "./service.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

router.post("/create",
     auth("TECHNICIAN"),
     serviceController.createService)



export const servicesRoutes = router;