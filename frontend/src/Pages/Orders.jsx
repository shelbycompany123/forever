import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../Context/ShopContext";
import Title from "../Component/Title";
import axios, { all } from "axios";
import { Link } from "react-router-dom";

const Orders = () => {
  const { backendUrl, token, formatCurrency } = useContext(ShopContext);

  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRatings, setUserRatings] = useState({});

  const loadOrderData = async () => {
    try {
      setLoading(true);
      if (!token) {
        return null;
      }

      const response = await axios.post(
        backendUrl + "/api/order/userorders",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setOrderData(response.data.orders.reverse());

        // Kiểm tra đánh giá của người dùng cho từng đơn hàng đã giao
        const ratings = {};
        for (const order of response.data.orders) {
          if (order.status === "da_giao") {
            try {
              const ratingResponse = await axios.post(
                `${backendUrl}/api/rating/order/user-ratings`,
                { orderId: order._id },
                { headers: { token } }
              );
              if (ratingResponse.data.success) {
                console.log(ratingResponse.data.userRatings);
                Object.assign(ratings, ratingResponse.data.userRatings);
              }
            } catch (error) {
              console.log("Error checking user ratings:", error);
            }
          }
        }
        setUserRatings(ratings);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  console.log(userRatings);
  useEffect(() => {
    loadOrderData();
  }, [token]);

  const getStatusColor = (status) => {
    switch (status) {
      case "chua_xac_nhan":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "da_xac_nhan":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "dang_giao":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "da_giao":
        return "bg-green-100 text-green-800 border-green-200";
      case "da_huy":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "chua_xac_nhan":
        return "⏳";
      case "da_xac_nhan":
        return "✅";
      case "dang_giao":
        return "🚚";
      case "da_giao":
        return "📦";
      case "da_huy":
        return "❌";
      default:
        return "📋";
    }
  };

  const getStatusName = (status) => {
    switch (status) {
      case "chua_xac_nhan":
        return "Chưa xác nhận";
      case "da_xac_nhan":
        return "Đã xác nhận";
      case "dang_giao":
        return "Đang giao";
      case "da_giao":
        return "Đã giao";
      case "da_huy":
        return "Đã hủy";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <Title text1={"ĐƠN"} text2={"HÀNG CỦA TÔI"} />
          </div>
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Title text1={"ĐƠN"} text2={"HÀNG CỦA TÔI"} />
          <div className="flex items-center gap-2 mt-2">
            <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
            <p className="text-gray-600">Bạn có {orderData.length} đơn hàng</p>
          </div>
        </div>

        {orderData.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Chưa có đơn hàng nào
            </h3>
            <p className="text-gray-600 mb-6">
              Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200"
            >
              Mua sắm ngay
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orderData.map((order, orderIdx) => (
              <div
                key={order._id || orderIdx}
                className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-all duration-200"
              >
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          #{order._id?.slice(-8)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>
                          📅 {new Date(order.date).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>💳 {order.paymentMethod}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        <span className="text-sm">
                          {getStatusIcon(order.status)}
                        </span>
                        <span className="text-sm font-medium capitalize">
                          {getStatusName(order.status)}
                        </span>
                      </div>
                      <button
                        onClick={loadOrderData}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        🔄 Cập nhật
                      </button>
                      <Link
                        to={`/order-details/${order._id}`}
                        className="px-4 py-2 text-sm font-medium text-black bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                      >
                        👁️ Xem chi tiết
                      </Link>
                      {order.status === "chua_xac_nhan" && (
                        <button
                          onClick={async () => {
                            try {
                              const options = confirm(
                                "Bạn có chắc chắn muốn huỷ đơn này không?"
                              );
                              if (options) {
                                await axios.post(
                                  backendUrl + "/api/order/status",
                                  { orderId: order._id, status: "da_huy" },
                                  { headers: { token } }
                                );
                                loadOrderData();
                              }
                            } catch (error) {
                              alert("Huỷ đơn thất bại!");
                            }
                          }}
                          className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors duration-200"
                        >
                          ❌ Huỷ đơn
                        </button>
                      )}
                      {order.status === "da_giao" &&
                        (() => {
                          const allRated = order.items.every(
                            (item) =>
                              userRatings[item._id] &&
                              userRatings[item._id].orderId === order._id
                          );
                          return (
                            <Link
                              to={`/review/${order._id}`}
                              className={`px-4 py-2 text-sm font-medium border rounded-lg transition-colors duration-200 ${
                                allRated
                                  ? "text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100"
                                  : "text-green-600 bg-green-50 border-green-200 hover:bg-green-100"
                              }`}
                            >
                              {allRated ? "✅ Đã đánh giá" : "⭐ Đánh giá"}
                            </Link>
                          );
                        })()}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item, idx) => (
                      <Link
                        to={`/product/${item._id}`}
                        key={idx}
                        className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all duration-200 group"
                      >
                        <div className="flex-shrink-0">
                          <img
                            className="w-20 h-20 object-cover rounded-lg border border-gray-200 group-hover:shadow-md transition-shadow duration-200"
                            src={item.image?.[0] || item.image}
                            alt={item.className || item.name}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-black transition-colors duration-200">
                            {item.className || item.name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                            <span className="text-lg font-bold text-black">
                              {formatCurrency(item.selling_price)}
                            </span>
                            <span className="flex items-center gap-1">
                              <span>📦</span>
                              <span>Số lượng: {item.quantity}</span>
                            </span>
                            {item.size && (
                              <span className="flex items-center gap-1">
                                <span>📏</span>
                                <span>Size: {item.size}</span>
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <div className="text-gray-400 group-hover:text-gray-600 transition-colors duration-200">
                            →
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
