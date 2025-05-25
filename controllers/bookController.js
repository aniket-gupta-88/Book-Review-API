const Book = require("../models/Book");
const Review = require("../models/Review");

//     GET /api/books
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find({});
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//     GET /api/books/:id
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate(
      "addedBy",
      "username email"
    );

    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    console.error(error);
    // Handle invalid MongoDB ID format
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid Book ID" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

//     POST /api/books
exports.addBook = async (req, res) => {
  const { title, author, genre, publicationYear, description } = req.body;

  try {
    // Check if a book with the same title and author already exists
    const existingBook = await Book.findOne({ title, author });
    if (existingBook) {
      return res
        .status(400)
        .json({ message: "A book with this title and author already exists." });
    }

    const book = new Book({
      title,
      author,
      genre,
      publicationYear,
      description,
      addedBy: req.user._id, // Assign the book to the authenticated user
    });

    const createdBook = await book.save();
    res.status(201).json(createdBook);
  } catch (error) {
    console.error(error);
    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Server error" });
  }
};

//     PUT /api/books/:id
exports.updateBook = async (req, res) => {
  const { title, author, genre, publicationYear, description } = req.body;
  try {
    const book = await Book.findById(req.params.id);

    if (book) {
      // Ensure only the owner can update their book
      if (!req.user || book.addedBy.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ message: "Not authorized to update this book" });
      }

      // Update fields, keeping existing values if not provided in request
      book.title = title || book.title;
      book.author = author || book.author;
      book.genre = genre || book.genre;
      book.publicationYear = publicationYear || book.publicationYear;
      book.description = description || book.description;

      const updatedBook = await book.save();
      res.json(updatedBook);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    console.error(error);
    // Handle invalid MongoDB ID format or validation errors
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid Book ID" });
    }
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Server error" });
  }
};

//     DELETE /api/books/:id
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (book) {
      // Ensure only the owner can delete their book
      if (book.addedBy.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ message: "Not authorized to delete this book" });
      }

      // Delete all associated reviews to prevent orphaned documents
      await Review.deleteMany({ book: req.params.id });

      await book.deleteOne();
      res.json({ message: "Book removed" });
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    console.error(error);
    // Handle invalid MongoDB ID format
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid Book ID" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

//     GET /api/books/search
exports.searchBooks = async (req, res) => {
  try {
    const searchTerm = req.query.q;

    if (!searchTerm) {
      return res.status(400).json({ message: "Search term (q) is required" });
    }

    // Escape special regex characters in the search term and use word boundaries for whole word matching
    const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escapedSearchTerm}\\b`, "i");

    // Search for books where title OR author matches the regex pattern
    const books = await Book.find({
      $or: [{ title: { $regex: regex } }, { author: { $regex: regex } }],
    }).populate("addedBy", "username");

    if (books.length === 0) {
      return res
        .status(404)
        .json({ message: "No books found matching your search" });
    }

    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
