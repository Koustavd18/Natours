const fs = require("fs");
const express = require("express");
const morgan = require("morgan");
const app = express();

//Middlewares

app.use(express.json());

app.use(morgan("dev"));

app.use((req, res, next) => {
  console.log("Hello from the Custom Middleware 🤟🏻");
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//IO Operations
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//Controllers
const getAllTours = (req, res) => {
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

const getTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    return res.status(404).json({
      status: "Failed",
      message: "invalid id",
    });
  }
  res.status(200).json({
    status: "Success",
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  const { id } = req.params;
  console.log(id);
  console.log(req.body);
  if (id > tours.length) {
    res.status(404).json({
      status: "failed",
      message: "Requested Tour not found",
    });
  }
  res.status(200).json({
    status: "Success",
    message: "<Resquested Tour has been upodated>",
  });
};

const deleteTour = (req, res) => {
  const { id } = req.params;
  console.log(id);

  if (id > tours.length) {
    res.status(404).json({
      status: "Not Found",
      message: "Tour not found",
    });
  }
  res.status(204).json({
    status: "Success",
    data: null,
  });
};

const home = (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to Natours",
  });
};

// Route Handlers

app.route("/").get(home);

app
  .route(`/api/v1/tours/:id`)
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

app.route("/api/v1/tours").get(getAllTours).post(createTour);

// app.patch("/api/v1/tours/:id", );

// app.delete("/api/v1/tours/:id", );

const port = 3000;
app.listen(port, () => {
  console.log("Application runing on port", +port, ".....");
});
