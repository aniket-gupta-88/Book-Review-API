const Review = require("../models/Review");
const Book = require("../models/Book");

//    GET /api/reviews/book/:bookId
exports.getReviewsForBook = async (req, res) => {
  try {
    const bookId = req.params.bookId;

    // Check if the book exists before fetching its reviews
    const bookExists = await Book.findById(bookId);
    if (!bookExists) {
      return res
        .status(404)
        .json({ message: "Book not found for the given ID" });
    }

    // Find all reviews for the specified book and populate user details
    const reviews = await Review.find({ book: bookId }).populate(
      "user",
      "username"
    );
    res.json(reviews);
  } catch (error) {
    console.error(error);
    // Handle invalid MongoDB ID format
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid Book ID" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

//    GET /api/reviews/:id
exports.getReviewById = async (req, res) => {
  try {
    // Find the review by ID and populate related user and book details
    const review = await Review.findById(req.params.id)
      .populate("user", "username email")
      .populate("book", "title author");

    if (review) {
      res.json(review);
    } else {
      res.status(404).json({ message: "Review not found" });
    }
  } catch (error) {
    console.error(error);
    // Handle invalid MongoDB ID format
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid Review ID" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

//    POST /api/reviews/:bookId
exports.addReview = async (req, res) => {
  const { rating, comment } = req.body;
  const bookId = req.params.bookId;

  try {
    // Verify that the book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Check if the authenticated user has already reviewed this specific book
    const alreadyReviewed = await Review.findOne({
      book: bookId,
      user: req.user._id, // User ID comes from the authentication middleware
    });

    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this book" });
    }

    // Create a new review instance
    const review = new Review({
      user: req.user._id,
      book: bookId,
      rating,
      comment,
    });

    // Save the review, which will trigger the post-save hook to update book's average rating
    const createdReview = await review.save();

    res.status(201).json(createdReview);
  } catch (error) {
    console.error(error);
    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    // Handle duplicate key error from the unique index (user, book)
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this book" });
    }
    // Handle invalid MongoDB ID format
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid Book ID" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

//    PUT /api/reviews/:id
exports.updateReview = async (req, res) => {
  const { rating, comment } = req.body;

  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Ensure only the owner can update their review
    if (review.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this review" });
    }

    // Update review fields, keeping existing values if not provided
    review.rating = rating || review.rating;
    review.comment = comment || review.comment;

    // Save the updated review, triggering the post-save hook to re-calculate average rating
    const updatedReview = await review.save();

    res.json(updatedReview);
  } catch (error) {
    console.error(error);
    // Handle invalid MongoDB ID format or validation errors
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid Review ID" });
    }
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Server error" });
  }
};

//    DELETE /api/reviews/:id
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Ensure only the owner can delete their review
    if (review.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this review" });
    }

    // Store book ID to ensure average rating is updated after deletion
    const bookId = review.book;

    // Delete the review document, triggering the post-remove hook to update book's average rating
    await review.deleteOne();

    res.json({ message: "Review removed" });
  } catch (error) {
    console.error(error);
    // Handle invalid MongoDB ID format
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid Review ID" });
    }
    res.status(500).json({ message: "Server error" });
  }
};
