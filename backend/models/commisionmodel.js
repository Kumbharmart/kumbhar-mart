const mongoose = require("mongoose");

const CommissionSchema = new mongoose.Schema(
  {
    salesman: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Salesman",
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    commissionAmount: {
      type: Number,
      required: true,
    },
    commissionRate: {
      type: Number,
      required: true, // e.g., 5% commission = 0.05
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Commission", CommissionSchema);
