import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { technicianProfileService } from "./technicianProfile.service";

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

export const technicianProfileController = {
  createTechnicianProfile,
};