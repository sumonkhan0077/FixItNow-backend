import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { availabilityService } from "./technicianAvailability.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus  from "http-status";

const createAvailability = catchAsync(async (req: Request, res:Response) => {
  const result = await availabilityService.createAvailabilityIntoDB(
    req.user!.id,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Availability created successfully",
    data: result,
  });
});

const getMyAvailability = catchAsync(async (req, res) => {
  const result = await availabilityService.getMyAvailabilityFromDB(
    req.user!.id
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Availability slots retrieved successfully",
    data: result,
  });
});

const updateAvailability = catchAsync(async (req, res) => {
  const result = await availabilityService.updateAvailabilityIntoDB(
    req.user!.id,
    req.user!.role,
    req.params.id,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Availability updated successfully",
    data: result,
  });
});

export const availabilityController = {
  createAvailability,
  getMyAvailability,
  updateAvailability,
};