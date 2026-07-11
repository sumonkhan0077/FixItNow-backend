import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus  from "http-status";

const createCheckoutSession = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { orderId } = req.body;

    const result = await paymentServices.createCheckoutSession(
      orderId,
      userId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Checkout session created successfully",
      data: result,
    });
  },
);

export const paymentController = {
  createCheckoutSession,
//   handleWebhook,
//   getPaymentHistory,
//   getPaymentDetails,
};