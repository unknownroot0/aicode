import prisma from "../../config/database";

export const listAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      role: true,
      isActive: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getAdminStats = async () => {
  const [totalProducts, totalOrders, totalCustomers, revenueResult] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { paymentStatus: "COMPLETED" },
      }),
    ]);

  return {
    totalProducts,
    totalOrders,
    totalCustomers,
    totalRevenue: Number(revenueResult._sum.totalAmount || 0),
  };
};
