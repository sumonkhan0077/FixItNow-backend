import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { userService } from "./user.service";

const registerUser = catchAsync( async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const user = await userService.registerUserIntoDB(payload);


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User registered successfully",
        data: { user }
    })
})

const getMyProfile = catchAsync( async (req: Request, res: Response, next: NextFunction) => {



    const profile = await userService.getMyProfileFromDB(req.user?.id as string);


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User profile fetched successfully",
        data: { profile }
    })
})


const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.getAllUsersFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Users retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const updateUserStatus = catchAsync(
  async (req: Request, res: Response) => {
    const result = await userService.updateUserStatusIntoDB(
      req.params.id as string,
      req.body
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User status updated successfully",
      data: result,
    });
  }
);


const updateUserRole = catchAsync(async (req, res) => {
  const result = await userService.updateUserRoleIntoDB(
    req.params.id as string,
    req.body.role
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User role updated successfully",
    data: result,
  });
});

export const userController = {
    registerUser,
    getMyProfile,    
    getAllUsers,
    updateUserStatus,
    updateUserRole,
}