const Tour = require("../models/tourModel");
// const fs = require("fs");

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
// );

exports.getAllTours = async (req, res) => {
  console.log("API requested at:", req.requestTime);

  try {
    const tours = await Tour.find();
    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "Failed",
      message: "inki Pinky Ponky",
      error: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

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
      status: "FAiled",
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
