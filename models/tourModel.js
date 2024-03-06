const mongoose = require("mongoose");

const slugify = require("slugify");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tour name is required and must be unique"],
      unique: true,
      trim: true,
      maxlength: [40, "Name must have lte 40 charcters"],
      minlenth: [10, "Name must have min 10 chareacters"],
    },
    slug: {
      type: String,
    },
    duration: {
      type: Number,
      required: [true, "A Tour duration is required"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "Group Size is required"],
    },
    difficulty: {
      type: String,
      required: [true, "Difficulty is required"],
      enum: {
        values: ["easy", "medium", "difficult", "hard"],
        message: "Wrong difficulty",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      max: [5, "Cannot be more than 5"],
      min: [1, "Cannot be less than 1"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A price for the tour is required"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: "Discount price ({VALUE} ) is less then the original price",
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "Must have a summary"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "Must have a cover image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
      select: false,
    },
    startLocation: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      //Geo Data
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.virtual("durationWeek").get(function () {
  return this.duration / 7;
});

tourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id",
});
//Document Middleware

// tourSchema.pre("save", function (next) {
//   console.log("Saving the Document", this);
// });

tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.post("save", function (doc, next) {
//   console.log(doc, this);
//   next();
// });

// tourSchema.pre("save" , async function() {
//   const guidesPromise = this.guides.map( async id => await User.findById(id));
//   this.guides = await Promise.all(guidesPromise)
// })

//Query  Middleware

tourSchema.pre(/^find/, function () {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log("Performance:", Date.now() - this.start);
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt",
  });
  next();
});

//Aggregation Middleware

tourSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
