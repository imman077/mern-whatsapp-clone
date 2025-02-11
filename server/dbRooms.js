const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    name: String,
  },
  {
    timestamps: true,
  }
);

const Rooms = mongoose.model("Room",roomSchema);

module.exports = Rooms;
