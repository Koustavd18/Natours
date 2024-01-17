const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Tour name is required and must be unique"],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, "A price for the tour is required"],
  },
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
