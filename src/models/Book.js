import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  bookId: { type: String, unique: true },
  title: { type: String, unique: true },
  slug: String,
  description: String,
  price: { type: Number, min: 100, max: 1000 },
  authors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

export default mongoose.model("Book", bookSchema);
