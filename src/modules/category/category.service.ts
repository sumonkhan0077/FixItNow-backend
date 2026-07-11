import { prisma } from "../../lib/prisma";
import { CreateCategoryPayload } from "./category.interface";

const createCategoryIntoDB = async (payload: CreateCategoryPayload) => {
  const isExist = await prisma.category.findUnique({
    where: {
      name: payload.name,
    },
  });

  if (isExist) {
    throw new Error("Category already exists");
  }

  const result = await prisma.category.create({
    data: payload,
  });

  return result;
};

const getAllCategoriesFromDB = async () => {
  const result = await prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

const deleteCategoryFromDB = async (categoryId: string) => {
 
  await prisma.category.findUniqueOrThrow({
    where: {
      id: categoryId,
    },
  });


  const serviceExists = await prisma.service.findFirst({
    where: {
      categoryId,
    },
  });

  if (serviceExists) {
    throw new Error(
      "Cannot delete category because it has services."
    );
  }

  return await prisma.category.delete({
    where: {
      id: categoryId,
    },
  });
};

export const categoryService = {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
  deleteCategoryFromDB,
};