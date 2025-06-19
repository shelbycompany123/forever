import express from "express";
import { loginUser, registerUser, adminLogin, listUser, getUserProfile } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);
userRouter.get('/listuser', listUser);
userRouter.get('/profile/:id', getUserProfile);

export default userRouter;