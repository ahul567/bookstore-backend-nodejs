import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
  purchaseId: { type: String, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
  purchaseDate: { type: Date, default: Date.now },
  price: Number,
  quantity: Number
});

export default mongoose.model("Purchase", purchaseSchema);
