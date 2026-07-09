import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { serviceService } from "./service.service";

const createService = catchAsync(async (req: Request, res: Response) => {
  const result = await serviceService.createServiceIntoDB(
    req.user!.id,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Service created successfully",
    data: result,
  });
});


const getAllServices = catchAsync(async (req: Request, res: Response) => {
  const result = await serviceService.getAllServicesFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Services retrieved successfully",
    data: result,
  });
});

export const serviceController = {
  createService,
  getAllServices,
};