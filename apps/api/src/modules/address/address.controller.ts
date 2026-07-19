import { asyncHandler } from "../../middleware/asyncHandler";
import { sendSuccess } from "../../utils/response";
import { BadRequestError } from "../../utils/errors";
import { AuthRequest } from "../../types";
import { createAddressSchema } from "./address.validation";
import { createAddress } from "./address.service";

export const createAddressController = asyncHandler(async (req: AuthRequest, res) => {
  const result = createAddressSchema.safeParse(req.body);
  if (!result.success) {
    throw new BadRequestError(result.error.issues[0].message);
  }

  const address = await createAddress(req.user!.userId, result.data);
  sendSuccess(res, 201, address, "Address created successfully");
});
