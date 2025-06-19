import express from "express"
import {addComment, getComments} from "../controllers/commentController.js"
import authUser from "../middleware/auth.js";

const commentRouter = express.Router()

// Dùng id thay vì productId
commentRouter.post('/add/:id', authUser, addComment)
commentRouter.get('/get/:id', getComments) // Bỏ auth để frontend có thể lấy comments

export default commentRouter;