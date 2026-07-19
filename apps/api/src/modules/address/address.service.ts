import prisma from "../../config/database";
import { NotFoundError } from "../../utils/errors";
import { CreateAddressInput } from "./address.validation";

export const createAddress = async (userId: string, input: CreateAddressInput) => {
  // create simple address; callers may pass full address in `street`
  const address = await prisma.address.create({
    data: {
      userId,
      street: input.street,
      city: input.city || "",
      zipCode: input.zipCode || "",
      country: input.country || "Bangladesh",
    },
  });

  return address;
};

export const getAddressById = async (userId: string, id: string) => {
  const addr = await prisma.address.findFirst({ where: { id, userId } });
  if (!addr) throw new NotFoundError("Address not found");
  return addr;
};
