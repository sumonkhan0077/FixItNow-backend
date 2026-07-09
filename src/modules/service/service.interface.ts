import { ServiceScalarWhereInput } from "../../../generated/prisma/models";

export type CreateServicePayload = {
  categoryId: string;
  title: string;
  description?: string;
  price: number;
};


export interface IServicesQuery extends ServiceScalarWhereInput {

    searchTerm?: string
    page?: string
    limit?: string
    sortOrder?: string
    sortBy?: string
} 