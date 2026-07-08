import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { technicianProfileService } from "./technicianProfile.service";
import  httpStatus  from "http-status";

const createTechnicianProfile = catchAsync(async (req, res) => {
  const userId = req.user!.id;

  const result = await technicianProfileService.createTechnicianProfileIntoDB(
    userId,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Technician profile created successfully",
    data: result,
  });
});


const updateTechnicianProfile = catchAsync(async (req, res) => {
  const userId = req.user!.id;

  const result =
    await technicianProfileService.updateTechnicianProfileIntoDB(
      userId,
      req.body
    );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Technician profile updated successfully",
    data: result,
  });
});

export const technicianProfileController = {
  createTechnicianProfile,
  updateTechnicianProfile
};