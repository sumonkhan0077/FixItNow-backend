import { Prisma } from "../../../generated/prisma/browser";
import { Role, UserStatus } from "../../../generated/prisma/enums";

export interface RegisterUserPayload {
  name: string;
  email: string;
  password: string;
  profileImage?: string;
  role?: Role;
}

export interface IUserQuery extends Prisma.UserWhereInput {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;

  role?: Role;
  status?: UserStatus;
}

export interface UpdateUserStatusPayload {
  status: UserStatus;
}
