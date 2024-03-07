const express = require("express");
const reviewController = require("../controllers/reviewController");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(reviewController.setTourAndUserId, reviewController.postReview);

router
  .route("/:id")
  .get(reviewController.getReviewById)
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

module.exports = router;
