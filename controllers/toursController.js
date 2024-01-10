const fs = require("fs");

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
);

exports.checkId = (req, res, next, val) => {
  console.log(`The requested id is: ${val}`);

  if (val > tours.length) {
    return res.status(404).json({
      status: "Failed",
      message: "Invalid Id",
    });
  }

  next();
};

exports.getAllTours = (req, res) => {
  console.log("API requested at:", req.requestTime);
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

exports.getTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  //   if (!tour) {
  //     return res.status(404).json({
  //       status: "Failed",
  //       message: "invalid id",
  //     });
  //   }
  res.status(200).json({
    status: "Success",
    data: {
      tour,
    },
  });
};

exports.checkBody = (req, res, next) => {
  console.log(req.body);

  if (!req.body.name) {
    return res.status(400).json({
      status: "Failed",
      message: "name not found. Please Enter a name for the tour",
    });
  }
  next();
};
exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign(req.body, { id: newId });
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) {
        throw err;
      }
      res.status(201).json({
        status: "success",
        data: {
          tour: newTour,
        },
      });
    },
  );
};

exports.updateTour = (req, res) => {
  //   const { id } = req.params;
  //   console.log(id);
  //   console.log(req.body);
  //   if (id > tours.length) {
  //     res.status(404).json({
  //       status: "failed",
  //       message: "Requested Tour not found",
  //     });
  //   }
  res.status(200).json({
    status: "Success",
    message: "<Resquested Tour has been upodated>",
  });
};

exports.deleteTour = (req, res) => {
  //   const { id } = req.params;
  //   console.log(id);

  //   if (id > tours.length) {
  //     res.status(404).json({
  //       status: "Not Found",
  //       message: "Tour not found",
  //     });
  //   }
  res.status(204).json({
    status: "Success",
    data: null,
  });
};
