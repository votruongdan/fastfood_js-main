const mongoose = require('mongoose');

const Category = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    is_delete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
module.exports = new mongoose.model('Category', Category);
