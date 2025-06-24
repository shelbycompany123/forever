import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../Context/ShopContext";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Title from "../Component/Title";

const OrderDetails = () => {
  const { backendUrl, token, formatCurrency, getDisplayPrice } =
    useContext(ShopContext);
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);

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
        const foundOrder = response.data.orders.find((o) => o._id === orderId);
        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          setError("Không tìm thấy đơn hàng");
        }
      }
    } catch (error) {
      console.error("Error loading order details:", error);
      setError("Có lỗi xảy ra khi tải thông tin đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrderDetails();
  }, [orderId, token]);

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

  const getTotalAmount = () => {
    if (!order?.items) return 0;
    return order.items.reduce((total, item) => {
      return total + item.selling_price * item.quantity;
    }, 0);
  };

  if (loading) {
    return (
      <div className="border-t pt-16 min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border-t pt-16 min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Có lỗi xảy ra
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
              to="/orders"
              className="inline-flex items-center px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200"
            >
              Quay lại danh sách đơn hàng
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="border-t pt-16 min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Không tìm thấy đơn hàng
            </h3>
            <p className="text-gray-600 mb-6">
              Đơn hàng bạn đang tìm kiếm không tồn tại.
            </p>
            <Link
              to="/orders"
              className="inline-flex items-center px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200"
            >
              Quay lại danh sách đơn hàng
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t pt-16 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              to="/orders"
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              ← Quay lại
            </Link>
            <div className="text-2xl">
              <Title text1={"CHI TIẾT"} text2={"ĐƠN HÀNG"} />
            </div>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Đơn hàng #{order._id?.slice(-8)}
                </h2>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-gray-600">
                  <span>
                    📅 Đặt ngày:{" "}
                    {new Date(order.date).toLocaleDateString("vi-VN")}
                  </span>
                  <span>💳 Thanh toán: {order.paymentMethod}</span>
                </div>
              </div>
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(
                  order.status
                )}`}
              >
                <span className="text-lg">{getStatusIcon(order.status)}</span>
                <span className="font-semibold">
                  {getStatusName(order.status)}
                </span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Sản phẩm đã đặt
            </h3>
            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-4 rounded-lg border border-gray-100"
                >
                  <div className="flex-shrink-0">
                    <img
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                      src={item.image?.[0] || item.image}
                      alt={item.className || item.name}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {item.className || item.name}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <span>💰</span>
                        <span className="font-semibold text-green-600">
                          {formatCurrency(getDisplayPrice(item) || item.price)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>📦</span>
                        <span>Số lượng: {item.quantity}</span>
                      </div>
                      {item.size && (
                        <div className="flex items-center gap-1">
                          <span>📏</span>
                          <span>Size: {item.size}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      Tổng:{" "}
                      {formatCurrency(
                        (getDisplayPrice(item) || item.price) * item.quantity
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center text-lg font-semibold text-gray-900">
                <span>Tổng cộng:</span>
                <span className="text-2xl text-green-600">
                  {formatCurrency(getTotalAmount())}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={loadOrderDetails}
            className="flex-1 px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            🔄 Cập nhật trạng thái
          </button>
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
                    loadOrderDetails();
                  }
                } catch (error) {
                  alert("Huỷ đơn thất bại!");
                }
              }}
              className="flex-1 px-6 py-3 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors duration-200"
            >
              ❌ Huỷ đơn hàng
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
