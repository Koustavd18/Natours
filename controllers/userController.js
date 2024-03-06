const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("./factoryHandlers");
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};

  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });

  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({});

  res.status(200).json({
    status: "success",
    number_of_users: users.length,
    data: {
      users,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError("You are not allowed to do this", 400));
  }

  const filteredBody = filterObj(req.body, "name", "email");

  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "SUCCESS ",
    message: "Successfully updated",
    data: {
      updatedUser,
    },
  });
});

exports.getUser = (req, res) => {
  res.status(500).json({
    status: "Error",
    message: "This route is not yet defined",
  });
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: "Error",
    message: "This route is not yet Defined",
  });
};

exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

// exports.updateUser = (req, res) => {
//   res.status(500).json({
//     status: "Error",
//     message: "This route is not yet defined",
//   });
// };

// exports.deleteUser = catchAsync(async (req, res) => {
//   const deleteUser = await User.findByIdAndUpdate(req.user._id, {
//     active: false,
//   });
//   res.status(204).json({
//     status: "Success",
//     message: "User Deleted",
//   });
// });
