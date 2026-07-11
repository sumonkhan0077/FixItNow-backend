import Stripe from "stripe";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { BookingStatus, PaymentProvider, PaymentStatus } from "../../../generated/prisma/enums";
import { stripe } from "../../lib/stripe";



const createCheckoutSession = async (
  bookingId: string,
  customerId: string
) => {
  return await prisma.$transaction(async (tx) => {
    // Booking
    const booking = await tx.booking.findFirst({
      where: {
        id: bookingId,
        customerId,
      },
      include: {
        customer: true,
        service: true,
      },
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.status !== BookingStatus.ACCEPTED) {
      throw new Error("Booking is not accepted yet");
    }

    // Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "bdt",

            product_data: {
              name: booking.service.title,
            },

            unit_amount: Math.round(Number(booking.totalAmount) * 100),
          },

          quantity: 1,
        },
      ],

      customer_email: booking.customer.email,

      success_url: `${config.app_url}/payment?success=true`,

      cancel_url: `${config.app_url}/payment?success=false`,

      client_reference_id: booking.id,

      metadata: {
        bookingId: booking.id,
        customerId,
      },
    });


    return {
      checkoutUrl: session.url,
    };
  });
};

export const paymentServices = {
  createCheckoutSession,

};