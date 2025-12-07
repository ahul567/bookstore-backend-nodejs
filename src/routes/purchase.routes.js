import express from "express";
import { buyBook, getHistory } from "../controllers/purchase.controller.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, buyBook);
router.get("/history", auth, getHistory);

export default router;
