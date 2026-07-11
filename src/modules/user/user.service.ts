import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import { IUserQuery, RegisterUserPayload, UpdateUserStatusPayload } from "./user.interface";
import { Prisma, Role } from "../../../generated/prisma/browser";

const registerUserIntoDB = async (payload: RegisterUserPayload) => {
  const { name, email, password, role , profileImage } = payload;
  const isUserExist = await prisma.user.findUnique({
    where: { email },
  });

  if (isUserExist) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role 
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      id: createdUser.id,
      email: createdUser.email || email,
    },
    omit: {
      password: true,
    },
  });

  return user;
};

const getMyProfileFromDB = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    omit: {
      password: true,
    },
  });

  if (user.role === "TECHNICIAN") {
    const technicianProfile = await prisma.technicianProfile.findUnique({
      where: {
        userId,
      },
    });

    return {
      ...user,
      technicianProfile,
    };
  }

  return user;

};


const getAllUsersFromDB = async (query: IUserQuery) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder || "desc";

  const andConditions: Prisma.UserWhereInput[] = [];

  // Search
  if (query.searchTerm) {
    andConditions.push({
      OR: [
        {
          name: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  // Role Filter
  if (query.role) {
    andConditions.push({
      role: query.role as any,
    });
  }

  // Status Filter
  if (query.status) {
    andConditions.push({
      status: query.status as any,
    });
  }

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const data = await prisma.user.findMany({
    where: whereConditions,
    omit: {
      password: true,
    },
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.user.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data,
  };
};


const updateUserStatusIntoDB = async (
  userId: string,
  payload: UpdateUserStatusPayload
) => {
  
  await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });

  const result = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      status: payload.status,
    },
    omit: {
      password: true,
    },
  });

  return result;
};

const updateUserRoleIntoDB = async (
  userId: string,
  role: Role
) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });

  if (user.role === role) {
    throw new Error(`User is already a ${role}`);
  }

  const result = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });

  return result;
};

export const userService = {
  registerUserIntoDB,
  getMyProfileFromDB,
  getAllUsersFromDB,
  updateUserStatusIntoDB,
  updateUserRoleIntoDB,
};
