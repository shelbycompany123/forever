import commentModel from "../models/commentModel.js";
import userModel from "../models/userModel.js";

const addComment = async (req, res) => {
    try {
        const {comment} = req.body;
        const {id} = req.params;
        const userId = req.body.userId;

        const newComment = new commentModel({
            userId,
            productId: id,
            comment,
            date: Date.now()
        })

        await newComment.save();
        res.json({success: true, message: "Đã thêm bình luận"})

    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

const getComments = async (req, res) => {
    try {
        const {id} = req.params;

        const comments = await commentModel.find({productId: id}).sort({date: -1});

        const commentWithUser = await Promise.all(
            comments.map(async (comment) => {
                const user = await userModel.findById(comment.userId);
                return {
                    ...comment._doc,
                    name: user ? user.name : "Người dùng ẩn danh"
                }
            })
        );

        res.json({success: true, comments: commentWithUser})

    } catch (error) {   
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

export {addComment, getComments}