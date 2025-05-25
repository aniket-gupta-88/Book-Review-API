const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  rating: {
    type: Number,
    required: [true, "Please add a rating (1-5)"],
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    trim: true,
    maxlength: 500,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

ReviewSchema.index({ user: 1, book: 1 }, { unique: true });

ReviewSchema.statics.getAverageRating = async function (bookId) {
  const obj = await this.aggregate([
    {
      $match: { book: bookId },
    },
    {
      $group: {
        _id: "$book",
        averageRating: { $avg: "$rating" },
        numReviews: { $sum: 1 },
      },
    },
  ]);

  try {
    await this.model("Book").findByIdAndUpdate(bookId, {
      averageRating: obj[0] ? obj[0].averageRating : 0,
      numReviews: obj[0] ? obj[0].numReviews : 0,
    });
  } catch (err) {
    console.error(err);
  }
};

ReviewSchema.post("save", async function () {
  await this.constructor.getAverageRating(this.book);
});

ReviewSchema.post("remove", async function () {
  await this.constructor.getAverageRating(this.book);
});

module.exports = mongoose.model("Review", ReviewSchema);
