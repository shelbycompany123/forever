import express from "express";
import {
  getInventoryProducts,
  getLowStockProducts,
  restockProduct,
  getInventoryStats,
  getProductHistory,
} from "../controllers/inventoryController.js";
import adminAuth from "../middleware/adminAuth.js";

const inventoryRoute = express.Router();

inventoryRoute.get("/", adminAuth, getInventoryProducts);
inventoryRoute.get("/history/:productId", adminAuth, getProductHistory);
inventoryRoute.get("/low-stock", adminAuth, getLowStockProducts);
inventoryRoute.post("/restock", adminAuth, restockProduct);
inventoryRoute.get("/stats", adminAuth, getInventoryStats);

export default inventoryRoute;
