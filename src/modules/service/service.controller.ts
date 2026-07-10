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
     const query = req.query;
  const result = await serviceService.getAllServicesFromDB(query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Services retrieved successfully",
    data: result,
  });
});

const getMyServices = catchAsync(async (req: Request, res: Response) => {
  const result = await serviceService.getMyServicesFromDB(
    req.user!.id
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "My services retrieved successfully",
    data: result,
  });
});


const updateService = catchAsync(async (req: Request, res: Response) => {
  const result = await serviceService.updateServiceIntoDB(
    req.user!.id,
    req.params.id as string,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Service updated successfully",
    data: result,
  });
});


const getSingleService = catchAsync(
  async (req: Request, res: Response) => {
    const result = await serviceService.getSingleServiceFromDB(
      req.params.id as string
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Service retrieved successfully",
      data: result,
    });
  }
);

const deleteService = catchAsync(async (req, res) => {
  const result = await serviceService.deleteServiceFromDB(
    req.user!.id,
    req.user!.role,
    req.params.id as string
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Service deleted successfully",
    data: result,
  });
});

export const serviceController = {
  createService,
  getAllServices,
  getMyServices,
  updateService,
  getSingleService,
  deleteService,
};