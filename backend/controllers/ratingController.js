import ratingModel from "../models/RattingModel.js";
import userModel from "../models/userModel.js";

const getRatings = async (req, res) => {
  try {
    const { id } = req.params;

    const ratings = await ratingModel
      .find({ productId: id })
      .sort({ date: -1 });

    const ratingWithUser = await Promise.all(
      ratings.map(async (rating) => {
        const user = await userModel.findById(rating.userId);
        return {
          ...rating._doc,
          name: user ? user.name : "Người dùng ẩn danh",
        };
      })
    );

    const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    const averageRating =
      ratings.length > 0 ? (totalRating / ratings.length).toFixed(1) : 0;

    res.json({
      success: true,
      ratings: ratingWithUser,
      averageRating: parseFloat(averageRating),
      totalRatings: ratings.length,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Đánh giá sản phẩm dựa trên đơn hàng (cho phép đánh giá lại)
const addOrderRating = async (req, res) => {
  try {
    const { rating, comment, orderId } = req.body;
    const { id } = req.params; // productId
    const userId = req.body.userId;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.json({ success: false, message: "Rating phải từ 1-5 sao" });
    }

    // Kiểm tra xem người dùng đã đánh giá sản phẩm này trong đơn hàng này chưa
    const existingRating = await ratingModel.findOne({
      userId,
      productId: id,
      orderId: orderId,
    });

    if (existingRating) {
      // Kiểm tra xem đã sửa đánh giá tối đa 1 lần chưa
      if (existingRating.editCount >= 1) {
        return res.json({
          success: false,
          message: "Bạn đã sửa đánh giá tối đa 1 lần rồi",
        });
      }

      // Cập nhật đánh giá hiện có
      existingRating.rating = rating;
      existingRating.comment = comment || "";
      existingRating.editCount = (existingRating.editCount || 0) + 1;
      existingRating.date = Date.now();
      await existingRating.save();
      res.json({ success: true, message: "Đã cập nhật đánh giá thành công" });
    } else {
      // Tạo đánh giá mới
      const newRating = new ratingModel({
        userId,
        productId: id,
        orderId: orderId,
        rating,
        comment: comment || "",
        editCount: 0,
        date: Date.now(),
      });

      await newRating.save();
      res.json({ success: true, message: "Đã thêm đánh giá thành công" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Lấy đánh giá của người dùng cho đơn hàng cụ thể
const getUserOrderRatings = async (req, res) => {
  try {
    const userId = req.body.userId;
    const { orderId } = req.body;

    if (!orderId) {
      return res.json({
        success: false,
        message: "OrderId là bắt buộc",
      });
    }

    const ratings = await ratingModel.find({
      userId,
      orderId: orderId,
    });

    const userRatings = {};
    ratings.forEach((rating) => {
      userRatings[rating.productId] = {
        rating: rating.rating,
        comment: rating.comment,
        date: rating.date,
      };
    });

    res.json({
      success: true,
      userRatings,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { getRatings, addOrderRating, getUserOrderRatings };
