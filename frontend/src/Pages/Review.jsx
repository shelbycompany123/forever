import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";
import Title from "../Component/Title";
import axios from "axios";
import toast from "react-hot-toast";

const Review = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { backendUrl, token, formatCurrency } = useContext(ShopContext);

  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});
  const [userRatings, setUserRatings] = useState({});

  // Lấy thông tin đơn hàng
  const loadOrderData = async () => {
    try {
      setLoading(true);
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.post(
        backendUrl + "/api/order/userorders",
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        const order = response.data.orders.find((o) => o._id === orderId);
        if (order && order.status === "da_giao") {
          setOrderData(order);

          // Lấy đánh giá hiện tại của người dùng cho đơn hàng này
          try {
            const ratingResponse = await axios.post(
              `${backendUrl}/api/rating/order/user-ratings`,
              { orderId },
              { headers: { token } }
            );
            if (ratingResponse.data.success) {
              setUserRatings(ratingResponse.data.userRatings);
            }
          } catch (error) {
            console.log("Error checking user ratings:", error);
          }

          // Khởi tạo ratings và comments cho từng sản phẩm
          const initialRatings = {};
          const initialComments = {};
          order.items.forEach((item) => {
            initialRatings[item._id] = 5;
            initialComments[item._id] = "";
          });
          setRatings(initialRatings);
          setComments(initialComments);
        } else {
          toast.error("Không tìm thấy đơn hàng hoặc đơn hàng chưa được giao");
          navigate("/orders");
        }
      }
    } catch (error) {
      console.error("Error loading order:", error);
      toast.error("Có lỗi xảy ra khi tải thông tin đơn hàng");
      navigate("/orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [orderId, token]);

  // Cập nhật ratings và comments khi có userRatings
  useEffect(() => {
    if (orderData && Object.keys(userRatings).length > 0) {
      const updatedRatings = {};
      const updatedComments = {};
      orderData.items.forEach((item) => {
        const existingRating = userRatings[item._id];
        updatedRatings[item._id] = existingRating ? existingRating.rating : 5;
        updatedComments[item._id] = existingRating
          ? existingRating.comment
          : "";
      });
      setRatings(updatedRatings);
      setComments(updatedComments);
    }
  }, [userRatings, orderData]);

  // Xử lý thay đổi rating
  const handleRatingChange = (productId, rating) => {
    setRatings((prev) => ({
      ...prev,
      [productId]: rating,
    }));
  };

  // Xử lý thay đổi comment
  const handleCommentChange = (productId, comment) => {
    setComments((prev) => ({
      ...prev,
      [productId]: comment,
    }));
  };

  // Gửi đánh giá
  const handleSubmitReview = async () => {
    try {
      setSubmitting(true);

      // Kiểm tra xem có rating nào được chọn không
      const hasRatings = Object.values(ratings).some((rating) => rating > 0);
      if (!hasRatings) {
        toast.error("Vui lòng chọn ít nhất một đánh giá sao");
        return;
      }

      // Gửi đánh giá cho từng sản phẩm
      const reviewPromises = orderData.items.map(async (item) => {
        const rating = ratings[item._id];
        const comment = comments[item._id];

        if (rating > 0) {
          return axios.post(
            `${backendUrl}/api/rating/order/add/${item._id}`,
            {
              rating,
              comment,
              orderId,
            },
            { headers: { token } }
          );
        }
        return null;
      });

      const results = await Promise.all(reviewPromises);
      const successCount = results.filter(
        (result) => result && result.data.success
      ).length;

      if (successCount > 0) {
        const hasExistingRatings = Object.keys(userRatings).length > 0;
        toast.success(
          `Đã ${
            hasExistingRatings ? "cập nhật" : "gửi"
          } ${successCount} đánh giá thành công!`
        );
        navigate("/orders");
      } else {
        toast.error("Chỉ được đánh giá 1 lần cho mỗi sản phẩm");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Có lỗi xảy ra khi gửi đánh giá");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <Title text1={"ĐÁNH"} text2={"GIÁ SẢN PHẨM"} />
          </div>
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Title text1={"ĐÁNH"} text2={"GIÁ SẢN PHẨM"} />
          <div className="flex items-center gap-2 mt-2">
            <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
            <p className="text-gray-600">
              Đơn hàng #{orderData._id?.slice(-8)}
            </p>
          </div>
        </div>

        {/* Thông tin đơn hàng */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Thông tin đơn hàng
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Mã đơn hàng:</span>
              <p className="font-medium">#{orderData._id?.slice(-8)}</p>
            </div>
            <div>
              <span className="text-gray-600">Ngày đặt:</span>
              <p className="font-medium">
                {new Date(orderData.date).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Tổng tiền:</span>
              <p className="font-medium">{formatCurrency(orderData.amount)}</p>
            </div>
          </div>
        </div>

        {/* Danh sách sản phẩm để đánh giá */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Đánh giá sản phẩm ({orderData.items.length})
          </h3>

          {orderData.items.map((item, index) => (
            <div
              key={item._id || index}
              className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-all duration-200"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Thông tin sản phẩm */}
                <div className="flex gap-4 flex-1">
                  <div className="flex-shrink-0">
                    <img
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                      src={item.image?.[0] || item.image}
                      alt={item.className || item.name}
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {item.className || item.name}
                    </h4>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                      <span className="text-lg font-bold text-black">
                        {formatCurrency(item.selling_price)}
                      </span>
                      <span>Số lượng: {item.quantity}</span>
                      {item.size && <span>Size: {item.size}</span>}
                      {userRatings[item._id] && (
                        <span className="text-green-600 font-medium">
                          ✅ Đã đánh giá
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form đánh giá */}
                <div className="lg:w-80 space-y-4">
                  {/* Rating stars */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Đánh giá sao
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRatingChange(item._id, star)}
                          className={`text-2xl transition-colors duration-200 ${
                            ratings[item._id] >= star
                              ? "text-yellow-400"
                              : "text-gray-300"
                          } hover:text-yellow-400`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {ratings[item._id] === 1 && "Rất không hài lòng"}
                      {ratings[item._id] === 2 && "Không hài lòng"}
                      {ratings[item._id] === 3 && "Bình thường"}
                      {ratings[item._id] === 4 && "Hài lòng"}
                      {ratings[item._id] === 5 && "Rất hài lòng"}
                    </p>
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nhận xét (tùy chọn)
                    </label>
                    <textarea
                      value={comments[item._id]}
                      onChange={(e) =>
                        handleCommentChange(item._id, e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-lg p-3 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                      maxLength={500}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {comments[item._id].length}/500 ký tự
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Nút gửi đánh giá */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-end">
          <button
            onClick={() => navigate("/orders")}
            className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Quay lại
          </button>
          <button
            onClick={handleSubmitReview}
            disabled={submitting}
            className="px-6 py-3 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {submitting
              ? "Đang gửi..."
              : Object.keys(userRatings).length > 0
              ? "Cập nhật đánh giá"
              : "Gửi đánh giá"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Review;
