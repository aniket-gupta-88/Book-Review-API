const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a book title"],
    trim: true,
    minlength: 1,
  },
  author: {
    type: String,
    required: [true, "Please add an author"],
    trim: true,
  },
  genre: {
    type: String,
    trim: true,
  },
  publicationYear: {
    type: Number,
    min: 1000,
    max: new Date().getFullYear(),
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000,
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Book", BookSchema);
