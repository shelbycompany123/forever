import React, { useState, useEffect, useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import axios from "axios";

const ProductRating = ({ productId }) => {
  const { backendUrl } = useContext(ShopContext);
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);

  // Lấy ratings của sản phẩm
  const fetchRatings = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/rating/get/${productId}`
      );
      if (response.data.success) {
        setRatings(response.data.ratings);
        setAverageRating(response.data.averageRating);
        setTotalRatings(response.data.totalRatings);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchRatings();
    }
  }, [productId]);

  // Render stars
  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${
              rating >= star ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="mt-12 border-t pt-8">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-gray-900">
          Đánh giá sản phẩm ({totalRatings})
        </h3>
        {totalRatings > 0 && (
          <div className="flex items-center gap-2 mt-2">
            {renderStars(averageRating)}
            <span className="text-lg font-semibold text-gray-900">
              {averageRating}/5
            </span>
            <span className="text-sm text-gray-500">
              ({totalRatings} đánh giá)
            </span>
          </div>
        )}
      </div>

      {/* Danh sách ratings */}
      <div className="space-y-6">
        {ratings.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-lg font-medium">
              Chưa có đánh giá nào
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Hãy mua sản phẩm và đánh giá để chia sẻ trải nghiệm!
            </p>
          </div>
        ) : (
          ratings.map((rating, index) => (
            <div
              key={rating._id}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-lg">
                    {rating.name ? rating.name.charAt(0).toUpperCase() : "U"}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h5 className="font-semibold text-gray-900">
                        {rating.name || "Người dùng ẩn danh"}
                      </h5>
                      <div className="flex items-center gap-2 mt-1">
                        {renderStars(rating.rating)}
                        <span className="text-sm text-gray-500">
                          {new Date(rating.date).toLocaleDateString("vi-VN", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {index === 0 && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                            Mới nhất
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {rating.comment && (
                    <p className="text-gray-700 leading-relaxed">
                      {rating.comment}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer stats */}
      {ratings.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center text-sm text-gray-500">
            <span>Tổng cộng {totalRatings} đánh giá từ khách hàng</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductRating;
