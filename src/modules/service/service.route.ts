import { Router } from "express";
import { serviceController } from "./service.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

router.post("/create",
     auth("TECHNICIAN"),
     serviceController.createService);

router.get("/all", serviceController.getAllServices);



export const servicesRoutes = router;