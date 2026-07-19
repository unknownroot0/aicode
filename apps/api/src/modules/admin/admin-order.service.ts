import prisma from "../../config/database";
import { NotFoundError, BadRequestError } from "../../utils/errors";

const VALID_ORDER_STATUSES = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
] as const;

export const listAllOrders = async () => {
  return prisma.order.findMany({
    include: {
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      },
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              thumbnail: true,
              images: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const updateOrderStatus = async (
  id: string,
  status: string
) => {
  if (!VALID_ORDER_STATUSES.includes(status as any)) {
    throw new BadRequestError(
      `Invalid status. Must be one of: ${VALID_ORDER_STATUSES.join(", ")}`
    );
  }

  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) {
    throw new NotFoundError("Order not found");
  }

  return prisma.order.update({
    where: { id },
    data: { status: status as any },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      },
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              thumbnail: true,
              images: true,
            },
          },
        },
      },
    },
  });
};
