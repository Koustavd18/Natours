const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Tour name is required and must be unique"],
    unique: true,
  },
  duration: {
    type: Number,
    required: [true, "A Tour duration is required"],
  },
  maxGroupSize: {
    type: Number,
    required: [true, "Group Size is required"],
  },
  difficulty: {
    type: String,
    required: [true, "Difficulty is required"],
  },
  ratingsAvarage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, "A price for the tour is required"],
  },
  priceDiscount: {
    type: Number,
  },
  summary: {
    type: String,
    trim: true,
    required: [true, "Must have a summary"],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, "Must have a cover image"],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDate: [Date],
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
