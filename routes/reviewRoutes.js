const express = require("express");
const reviewController = require("../controllers/reviewController");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(authController.protect, reviewController.getAllReviews)
  .post(authController.protect, reviewController.postReview);

router
  .route("/:id")
  .get(authController.protect, reviewController.getReviewById)
  .patch(authController.protect, reviewController.updateReview)
  .delete(authController.protect, reviewController.deleteReview);

module.exports = router;
