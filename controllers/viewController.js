const Tour = require("../models/tourModel");
const catchAsync = require("../utils/catchAsync");

exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render("overview", { title: "All Tours", tours });
  next();
});

exports.getTour = catchAsync(async (req, res, next) => {
  const { tourName } = req.params;

  const tour = await Tour.findOne({ slug: tourName }).populate({
    path: "reviews",
    fields: "review rating user",
  });

  res.status(200).render("tour", { title: tour.name, tour });
  next();
});
