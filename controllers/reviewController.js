const Review = require("../models/reviewModel");
const catchAsync = require("../utils/catchAsync");
// const AppError = require("../utils/appError");
const factory = require("./factoryHandlers");

exports.setTourAndUserId = catchAsync((req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
});

exports.getAllReviews = factory.getAll(Review);

exports.postReview = factory.createOne(Review);

exports.updateReview = factory.updateOne(Review);

exports.deleteReview = factory.deleteOne(Review);

exports.getReviewById = factory.getOne(Review, { path: "user tour" });

// exports.postReview = catchAsync(async (req, res, next) => {
//   if (!req.body.tour) req.body.tour = req.params.tourId;
//   if (!req.body.user) req.body.user = req.user.id;
//   const newReview = await Review.create(req.body);

//   res.status(201).json({
//     status: "SUCCESS",
//     data: newReview,
//   });
// });

// exports.getReviewById = catchAsync(async (req, res, next) => {
//   const review = await Review.findById(req.params.id).populate({
//     path: "user tour",
//   });

//   res.status(200).json({
//     status: "SUCCESS",
//     data: review,
//   });
// });
