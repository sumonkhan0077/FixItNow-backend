import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { bookingService } from "./booking.service";

const createBooking = catchAsync(async (req: Request, res: Response) => {
  const result = await bookingService.createBookingIntoDB(
    req.user!.id,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Booking created successfully",
    data: result,
  });
});


const cancelBooking = catchAsync(async (req: Request, res: Response) => {
  const result = await bookingService.cancelBookingIntoDB(
    req.user!.id,
    req.params.id as string
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Booking cancelled successfully",
    data: result,
  });
});


const updateBookingStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await bookingService.updateBookingStatusIntoDB(
    req.user!.id,
    req.params.id as string,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Booking status updated successfully",
    data: result,
  });
});


const getMyBookings = catchAsync(async (req: Request, res: Response) => {
  const result = await bookingService.getMyBookingsFromDB(req.user!.id ,  req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "My bookings retrieved successfully",
    data: result,
  });
});

const getTechnicianBookings = catchAsync(
  async (req: Request, res: Response) => {
    const result = await bookingService.getTechnicianBookingsFromDB(
      req.user!.id,
      req.query
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Technician bookings retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

const getSingleBooking = catchAsync(async (req: Request, res: Response) => {
  const result = await bookingService.getSingleBookingFromDB(
    req.user!.id,
    req.user!.role,
    req.params.id as string
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Booking retrieved successfully",
    data: result,
  });
});


const getAllBookings = catchAsync(async (req, res) => {
  const result = await bookingService.getAllBookingsFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Bookings retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const bookingController = {
  createBooking,
  cancelBooking,
  updateBookingStatus,
  getMyBookings,
  getTechnicianBookings,
  getSingleBooking,
  getAllBookings,
  
};