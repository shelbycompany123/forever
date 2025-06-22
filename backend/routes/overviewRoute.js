import express from "express";
import {
  getRevenue,
  getTotalUsers,
  getTotalOrders,
  getTopSellingProducts,
} from "../controllers/overviewController.js";

const overviewRoute = express.Router();

overviewRoute.get("/getrevenue", getRevenue);
overviewRoute.get("/getusers", getTotalUsers);
overviewRoute.get("/getorders", getTotalOrders);
overviewRoute.get("/top-selling-products", getTopSellingProducts);

export default overviewRoute;
