const mongoose = require('mongoose');

const Order = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    total: {
      type: Number,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: 'Chờ xác nhận',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = new mongoose.model('Order', Order);
