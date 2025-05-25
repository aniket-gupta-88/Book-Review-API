const express = require("express");
const router = express.Router();
const {
  getBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook,
  searchBooks,
} = require("../controllers/bookController");
const { protect } = require("../middlewares/authMiddleware");

// public Routes

router.get("/", getBooks);
router.get("/search", searchBooks);
router.get("/:id", getBookById);

// protected Routes

router.post("/", protect, addBook);
router.put("/:id", protect, updateBook);
router.delete("/:id", protect, deleteBook);

module.exports = router;
