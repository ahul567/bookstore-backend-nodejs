import Book from "../models/Book.js";
import { slugify } from "../utils/slugify.js";

export const createBook = async (req, res) => {
  try {
    const { title, description, price, authors } = req.body;

    const count = await Book.countDocuments();
    const bookId = `book-${count + 1}`;

    const slug = slugify(title);

    const book = await Book.create({
      bookId, title, slug, description, price, authors
    });

    res.json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getBooks = async (req, res) => {
  const books = await Book.find().populate("authors");
  res.json(books);
};
