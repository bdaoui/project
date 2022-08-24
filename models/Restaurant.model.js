const { Schema, model } = require("mongoose");

const restaurantSchema = new Schema(
    {
    owner: { type: Schema.Types.ObjectId, ref: "User"},
    name: { type: String, required: [true, "Must include name"]},
    cuisine: { type: String, required: [true, "Please select a cuisine"]},
    imageUrl: { type: String},
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review"}],
    },
    {
        timestamps: true,
    },
);

const Restaurant = model('Restaurant', restaurantSchema);

module.exports = Restaurant


