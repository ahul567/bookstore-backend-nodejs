import Purchase from "../models/Purchase.js";
import Book from "../models/Book.js";
import User from "../models/User.js";
import { generatePurchaseId } from "../utils/generatePurchaseId.js";
import emailQueue from "../queue/email.queue.js";

export const buyBook = async (req, res) => {
  try {
    const { bookId, quantity } = req.body;

    const book = await Book.findById(bookId).populate("authors");

    const purchaseId = await generatePurchaseId();

    await Purchase.create({
      purchaseId,
      userId: req.user.id,
      bookId,
      price: book.price,
      quantity
    });

    // Revenue Distribution
    const totalAmount = book.price * quantity;

    book.authors.forEach(async (author) => {
      await User.updateOne({ _id: author._id }, { $inc: { revenue: totalAmount } });
      
      emailQueue.add({
        to: author.email,
        subject: "New Book Purchase",
        text: `Your book "${book.title}" was purchased. Revenue added: ₹${totalAmount}`
      });
    });

    res.json({ message: "Purchase successful", purchaseId });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getHistory = async (req, res) => {
  const history = await Purchase.find({ userId: req.user.id });
  res.json(history);
};
