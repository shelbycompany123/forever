import express from "express";
import {
  getRatings,
  addOrderRating,
  getUserOrderRatings,
} from "../controllers/ratingController.js";
import authUser from "../middleware/auth.js";

const ratingRouter = express.Router();

ratingRouter.get("/get/:id", getRatings); // No auth needed for frontend to get ratings
ratingRouter.post("/order/add/:id", authUser, addOrderRating);
ratingRouter.post("/order/user-ratings", authUser, getUserOrderRatings);

export default ratingRouter;
