import express from "express";
import { createAddressController } from "./address.controller";
const router = express.Router();

// POST /api/addresses
router.post("/", createAddressController);

export default router;
