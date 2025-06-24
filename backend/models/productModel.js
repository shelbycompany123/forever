import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  selling_price: {
    type: Number,
    required: true,
  },
  original_price: {
    type: Number,
    required: true,
  },
  promo_price: {
    type: Number,
    default: null,
  },
  promo_start: {
    type: Date,
    default: null,
  },
  promo_end: {
    type: Date,
    default: null,
  },
  image: {
    type: [String],
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subcategory",
    required: true,
  },

  sizes: {
    type: Map,
    of: Number,
    default: {},
  },
  reorderPoint: {
    type: Number,
    default: 100,
  },
  stockHistory: [
    {
      type: {
        type: String,
        enum: ["in", "out"],
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      size: {
        type: String,
        enum: ["S", "M", "L", "XL", "XXL"],
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
      note: String,
    },
  ],
  date: {
    type: Number,
    required: true,
    default: Date.now,
  },
});

const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
