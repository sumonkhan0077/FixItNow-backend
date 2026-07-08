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

export const categoryService = {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
};