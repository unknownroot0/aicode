import { Router } from "express";
import { signupController, loginController, logoutController, getMeController, updateProfileController, changePasswordController } from "./auth.controller";
import { authenticate } from "../../middleware/auth";
import { rateLimit } from "../../middleware/rateLimit";

const router = Router();

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 25, keyPrefix: "auth" });

router.post("/signup", authLimiter, signupController);
router.post("/login", authLimiter, loginController);
router.post("/logout", logoutController);

// Profile routes
router.get("/me", authenticate, getMeController);
router.patch("/profile", authenticate, updateProfileController);
router.patch("/change-password", authenticate, changePasswordController);

export default router;
