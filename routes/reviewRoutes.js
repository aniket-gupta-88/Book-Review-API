const express = require("express");
const router = express.Router();
const {
  getReviewsForBook,
  getReviewById,
  addReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const { protect } = require("../middlewares/authMiddleware");

// public Routes

router.get("/book/:bookId", getReviewsForBook);
router.get("/:id", getReviewById);

// protected Routes

router.post("/:bookId", protect, addReview);
router.put("/:id", protect, updateReview);
router.delete("/:id", protect, deleteReview);

module.exports = router;
