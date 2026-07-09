import { ServiceScalarWhereInput } from "../../../generated/prisma/models";

export type CreateServicePayload = {
  categoryId: string;
  title: string;
  description?: string;
  price: number;
};


export interface IServicesQuery {
  searchTerm?: string;
  categoryId?: string;
  serviceArea?: string;
  rating?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}