import { prisma } from "../../lib/prisma";
import { CreateAvailabilityPayload } from "./technicianAvailability.interface";

const createAvailabilityIntoDB = async (
  userId: string,
  payload: CreateAvailabilityPayload
) => {
 
  

export const availabilityService = {
  createAvailabilityIntoDB,
};