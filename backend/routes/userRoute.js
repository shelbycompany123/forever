import express from "express";
import {
  loginUser,
  registerUser,
  adminLogin,
  listUser,
  getUserProfile,
  updateUserInfo,
  getUserOrders,
  getUserRatings,
} from "../controllers/userController.js";
import authUser from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin);
userRouter.get("/listuser", listUser);
userRouter.get("/profile/:id", getUserProfile);
userRouter.get("/admin/profile/:id", adminAuth, getUserProfile);
userRouter.get("/admin/orders/:userId", adminAuth, getUserOrders);
userRouter.get("/admin/ratings/:userId", adminAuth, getUserRatings);
userRouter.put("/update-info", authUser, updateUserInfo);

export default userRouter;
