import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { categoryController } from "./category.controller";

const router = Router();

router.post("/create", 
    auth("ADMIN"), 
categoryController.createCategory )

router.get(
  "/all",
  categoryController.getAllCategories
);

router.delete(
  "/delete/:id",
  auth("ADMIN"),
  categoryController.deleteCategory
);


export const categoriesRoutes = router;