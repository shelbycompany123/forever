import express from "express";
import {
  addProduct,
  listProducts,
  removeProduct,
  singleProduct,
  getProduct,
  updateProduct,
  filterProducts,
  getSaleProducts,
  getRelatedProducts,
} from "../controllers/productController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const productRouter = express.Router();

productRouter.post("/add", upload.array("images", 10), addProduct);
productRouter.get("/get/:id", getProduct);

productRouter.post("/remove", adminAuth, removeProduct);

productRouter.post("/single", singleProduct);

productRouter.get("/list", listProducts);

productRouter.put(
  "/update/:id",
  adminAuth,
  upload.array("images", 10),
  updateProduct
);

productRouter.get("/filter", filterProducts);
productRouter.get("/sale", getSaleProducts);
productRouter.get("/related", getRelatedProducts);

export default productRouter;
