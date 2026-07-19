import { Router } from "express";
import { authenticate, authorizeAdmin } from "../../middleware/auth";
import {
  listAllUsersController,
  getAdminStatsController,
} from "./admin-user.controller";

const router = Router();

router.get("/", authenticate, authorizeAdmin, listAllUsersController);
router.get("/stats", authenticate, authorizeAdmin, getAdminStatsController);

export default router;
