const express = require("express");
const tourController = require("../controllers/toursController");
const authController = require("../controllers/authController");
const reviewRouter = require("./reviewRoutes");

const router = express.Router();

// router.param("id", tourController.checkId);

router
  .route("/top-5-cheap")
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route("/tour-stats").get(tourController.getTourStats);
router
  .route("/monthly-plan/:year")
  .get(
    authController.restrictTo("admin", "lead-guide", "guide"),
    tourController.getMonthlyPlan,
  );
router.route("/tour-name/:id").get(tourController.getTourName);

router.use(authController.protect);

router
  .route("/")
  .get(authController.protect, tourController.getAllTours)
  .post(
    authController.restrictTo("admin", "lead-guide"),
    tourController.createTour,
  );

router
  .route(`/:id`)
  .get(tourController.getTour)
  .patch(
    authController.restrictTo("admin", "lead-guide"),
    tourController.updateTour,
  )
  .delete(
    authController.restrictTo("admin", "lead-guide"),
    tourController.deleteTour,
  );

router.use("/:tourId/reviews", reviewRouter);

module.exports = router;
