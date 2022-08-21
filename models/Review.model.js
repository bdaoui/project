const { Schema, model } = require("mongoose");

const reviewSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  comment: { type: String, required: true, maxlength: 250 },
  stars: {type: Number, min:1, max: 5 }
},
{
  timestamps: true,
});

const Review = model("Review", reviewSchema);

module.exports = Review;