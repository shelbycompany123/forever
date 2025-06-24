import mongoose from "mongoose";

// Schema cho Category (Danh mục chính)
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
});

const subcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
});

const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);
const Subcategory =
  mongoose.models.Subcategory ||
  mongoose.model("Subcategory", subcategorySchema);

export { Category, Subcategory };
