import Stripe from "stripe";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { BookingStatus, PaymentProvider, PaymentStatus, Role } from "../../../generated/prisma/enums";
import { stripe } from "../../lib/stripe";
import { Prisma } from "../../../generated/prisma/client";



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


const handleWebhook = async (
  rawBody: Buffer | string,
  signature: string,
) => {
  let event: Stripe.Event;

  try {
    const buffer =
      typeof rawBody === "string" ? Buffer.from(rawBody) : rawBody;

    event = stripe.webhooks.constructEvent(
      buffer,
      signature,
      config.stripe_webhook_secret as string,
    );

    console.log("Webhook signature verified");
  } catch (err: any) {
    throw new Error(`Webhook signature verification failed: ${err.message}`);
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      const bookingId = session.metadata?.bookingId;
      const customerId = session.metadata?.customerId;

      if (!bookingId || !customerId) {
        console.warn("BookingId or CustomerId missing in metadata");
        break;
      }

      await prisma.$transaction(async (tx) => {
        // Booking Exists?
        const booking = await tx.booking.findUnique({
          where: {
            id: bookingId,
          },
          include: {
            payment: true,
          },
        });

        if (!booking) {
          console.log("Booking not found");
          return;
        }

        // Prevent duplicate payment
        if (booking.payment) {
          console.log("Payment already completed");
          return;
        }

        // Create Payment
        const payment = await tx.payment.create({
          data: {
            bookingId,
            customerId,
            provider: PaymentProvider.STRIPE,
            transactionId:
              (session.payment_intent as string) || session.id,
            amount: booking.totalAmount,
            status: PaymentStatus.COMPLETED,
            paidAt: new Date(),
          },
        });

        console.log("Payment Created");
        console.log("Transaction:", payment.transactionId);

        // Update Booking Status
        await tx.booking.update({
          where: {
            id: bookingId,
          },
          data: {
            status: BookingStatus.PAID, 
          },
        });

        console.log(" Booking Updated");
      });

      break;
    }

    case "checkout.session.expired":
    case "payment_intent.payment_failed": {
      const session = event.data.object as Stripe.Checkout.Session;

      console.log(" Payment Failed");
      console.log("Booking:", session.metadata?.bookingId);

      break;
    }

    default:
      console.log(`Unhandled Event: ${event.type}`);
      break;
  }

  return {
    received: true,
  };
};
;

const getPaymentHistoryFromDB = async (
  userId: string,
  role: Role,
  query: any
) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder || "desc";

  const andConditions: Prisma.PaymentWhereInput[] = [];

  // Customer can only see own payments
  if (role === Role.CUSTOMER) {
    andConditions.push({
      customerId: userId,
    });
  }

  // Admin Filters
  if (role === Role.ADMIN) {
    if (query.status) {
      andConditions.push({
        status: query.status,
      });
    }

    if (query.provider) {
      andConditions.push({
        provider: query.provider,
      });
    }

    if (query.customerId) {
      andConditions.push({
        customerId: query.customerId,
      });
    }

    if (query.bookingId) {
      andConditions.push({
        bookingId: query.bookingId,
      });
    }
  }

  const where: Prisma.PaymentWhereInput =
    andConditions.length > 0
      ? { AND: andConditions }
      : {};

  const data = await prisma.payment.findMany({
    where,
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          profileImage: true,
        },
      },
      booking: {
        include: {
          service: {
            include: {
              category: true,
              technicianProfile: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.payment.count({
    where,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data,
  };
};

const getPaymentDetailsFromDB = async (
  paymentId: string,
  userId: string,
  role: Role
) => {
  // Admin can view any payment
  if (role === Role.ADMIN) {
    return await prisma.payment.findUniqueOrThrow({
      where: {
        id: paymentId,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
        booking: {
          include: {
            service: {
              include: {
                category: true,
                technicianProfile: {
                  include: {
                    user: {
                      select: {
                        id: true,
                        name: true,
                        email: true,
                        profileImage: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  // Customer can view only own payment
  return await prisma.payment.findFirstOrThrow({
    where: {
      id: paymentId,
      customerId: userId,
    },
    include: {
      booking: {
        include: {
          service: {
            include: {
              category: true,
              technicianProfile: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                      profileImage: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
};

export const paymentServices = {
  createCheckoutSession,
  handleWebhook,
  getPaymentHistoryFromDB,
  getPaymentDetailsFromDB

};