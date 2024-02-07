/* eslint-disable node/no-unsupported-features/es-syntax */
const Tour = require("../models/tourModel");
const APIFeatures = require("../utils/apiFeatures");

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAvarage,price";
  req.query.fields = "name,price,ratingsAvarage,summary,difficulty";
  next();
};

exports.getAllTours = async (req, res) => {
  console.log("API requested at:", req.requestTime);

  try {
    //Execute query

    console.log(req.query);
    const feature = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours = await feature.query;

    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (Error) {
    res.status(404).json({
      status: "Failed",
      message: "Inki Pinky Ponky",
      error: Error,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    //Tour.findOne({req.params.id}) in mongo shell

    // Tour.findOne({_id:req.params.id})

    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: "daddy bought a donkey",
      error: err,
    });
  }
  //   if (!tour) {
  //     return res.status(404).json({
  //       status: "Failed",
  //       message: "invalid id",
  //     });
  //   }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      message: "Inki pinki ponky",
      error: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      message: "Donkey Die ",
      error: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "Success",
      message: "Successfully deleted the tour",
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      messgae: "Daddy Cry",
      error: err,
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: "$difficulty" },
          numTours: { $sum: 1 },
          numRatings: { $sum: "$ratingsQuantity" },
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      {
        $sort: { avgPrice: -1 },
      },
      // {
      //   $match: { _id: { $ne: "EASY" } },
      // },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "Failed",
      message: err,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const { year } = req.params;

    const plan = await Tour.aggregate([
      {
        $unwind: "$startDates",
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$startDates" },
          numTourStarts: { $sum: 1 },
          tourName: { $push: "$name" },
        },
      },
      {
        $sort: { numTourStarts: -1 },
      },
      {
        $addFields: { month: "$_id" },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);

    res.status(200).json({
      status: "OK",
      year,
      results: plan.length,
      data: {
        plan,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "Failed",
      message: error,
    });
  }
};

// 1)Filter
// const queryObj = { ...req.query };
// const excludeFields = ["page", "sort", "limit", "fields"];
// excludeFields.forEach((el) => delete queryObj[el]);

// 2)Advanced Filter

// let queryStr = JSON.stringify(queryObj);
// queryStr = JSON.parse(
//   queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`),
// );

// let query = Tour.find(queryStr);

// 3)Sorting
// if (req.query.sort) {
//   const sortBy = req.query.sort.split(",").join(" ");
//   query = query.sort(sortBy);
// } else {
//   query = query.sort("-createdAt");
// }

//4)Fields

// if (req.query.fields) {
//   const field = req.query.fields.split(",").join(" ");
//   query = query.select(field);
// } else {
//   query = query.select("-__v");
// }

//5)Pagination

// const { page } = req.query || 1;
// const { limit } = req.query || 10;
// const skip = (page - 1) * limit;

// query = query.skip(skip).limit(limit);

// if (req.query.page) {
//   const numTours = await Tour.countDocuments();
//   if (skip >= numTours) {
//     throw new Error("PageNotFound");
//   }
// }
