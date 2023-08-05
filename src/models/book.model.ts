import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  isbn: String,
});

const Book = mongoose.model("Book", bookSchema);
export default Book;
