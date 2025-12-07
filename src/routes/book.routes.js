import express from "express";
import { createBook, getBooks } from "../controllers/book.controllers.js";
import { auth } from "../middleware/auth.js";
import { authorize } from "../middleware/role.js";

const router = express.Router();

router.post("/", auth, authorize("admin", "author"), createBook);
router.get("/", getBooks);

export default router;
