import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { backendUrl } from "../App";
import axios from "axios";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingCart,
  Package,
  Star,
  Eye,
} from "lucide-react";

const UserDetail = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("info");

  // Lấy token từ localStorage
  const token = localStorage.getItem("token");

  const fetchUserDetail = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        backendUrl + `/api/user/admin/profile/${userId}`,
        {
          headers: {
            token,
          },
        }
      );
      if (response.data.success) {
        setUser(response.data.user);
      } else {
        toast.error(response.data.message);
        navigate("/user");
      }
    } catch (error) {
      console.log(error);
      toast.error("Lỗi khi tải thông tin người dùng");
      navigate("/user");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOrders = async () => {
    try {
      const response = await axios.get(
        backendUrl + `/api/user/admin/orders/${userId}`,
        {
          headers: {
            token,
          },
        }
      );
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUserRatings = async () => {
    try {
      const response = await axios.get(
        backendUrl + `/api/user/admin/ratings/${userId}`,
        {
          headers: {
            token,
          },
        }
      );
      if (response.data.success) {
        setRatings(response.data.ratings);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserDetail();
    fetchUserOrders();
    fetchUserRatings();
  }, [userId]);

  const getStatusColor = (status) => {
    switch (status) {
      case "chua_xac_nhan":
        return "status-pending";
      case "da_xac_nhan":
        return "status-processing";
      case "dang_giao":
        return "status-processing";
      case "da_giao":
        return "status-success";
      case "da_huy":
        return "status-cancelled";
      default:
        return "status-pending";
    }
  };

  const getOrderStatusName = (status) => {
    switch (status) {
      case "chua_xac_nhan":
        return "Chưa xác nhận";
      case "da_xac_nhan":
        return "Đã xác nhận";
      case "dang_giao":
        return "Đang giao hàng";
      case "da_giao":
        return "Đã giao hàng";
      case "da_huy":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <User className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Không tìm thấy người dùng
        </h3>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="card">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/user")}
                className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                title="Quay lại"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-black">
                  Chi tiết người dùng
                </h1>
                <p className="text-gray-600 mt-1">
                  Thông tin chi tiết người dùng
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="card-body">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("info")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "info"
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              Thông tin
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "orders"
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              Đơn hàng ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab("ratings")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "ratings"
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              Đánh giá ({ratings.length})
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "info" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-black">
                  Thông tin cá nhân
                </h3>
              </div>
              <div className="card-body">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-semibold text-2xl">
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </span>
                  </div>
                  <h4 className="text-xl font-semibold text-black">
                    {user.name || "Chưa cập nhật"}
                  </h4>
                  <p className="text-gray-600">ID: {user._id}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="text-black font-medium">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone size={18} className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Số điện thoại</p>
                      <p className="text-black font-medium">
                        {user.phone || "Chưa cập nhật"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-gray-400 mt-1" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Địa chỉ</p>
                      <p className="text-black font-medium">
                        {user.address || "Chưa cập nhật"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">
                        Ngày tạo tài khoản
                      </p>
                      <p className="text-black font-medium">
                        {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details Card */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-black">
                  Thông tin chi tiết
                </h3>
              </div>
              <div className="card-body">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Cart Information */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <ShoppingCart size={20} className="text-blue-500" />
                      <h4 className="text-lg font-semibold text-black">
                        Giỏ hàng
                      </h4>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">
                        Số sản phẩm trong giỏ
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        {user.cartData ? Object.keys(user.cartData).length : 0}
                      </p>
                    </div>
                  </div>

                  {/* Orders Information */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Package size={20} className="text-green-500" />
                      <h4 className="text-lg font-semibold text-black">
                        Đơn hàng
                      </h4>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Tổng đơn hàng</p>
                      <p className="text-2xl font-bold text-green-600">
                        {orders.length}
                      </p>
                    </div>
                  </div>

                  {/* Ratings Information */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Star size={20} className="text-yellow-500" />
                      <h4 className="text-lg font-semibold text-black">
                        Đánh giá
                      </h4>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Tổng đánh giá</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {ratings.length}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cart Items Preview */}
                {user.cartData && Object.keys(user.cartData).length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-black mb-4">
                      Sản phẩm trong giỏ hàng
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">
                        Người dùng có {Object.keys(user.cartData).length} sản
                        phẩm trong giỏ hàng
                      </p>
                      <div className="mt-2 text-xs text-gray-500">
                        ID sản phẩm: {Object.keys(user.cartData).join(", ")}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-black">
              Lịch sử đơn hàng
            </h3>
          </div>
          <div className="card-body">
            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-black">
                          Đơn hàng #{order._id.slice(-8)}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {formatDate(order.date)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getOrderStatusName(order.status)}
                        </span>
                        <button
                          onClick={() => navigate(`/orders/${order._id}`)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Số sản phẩm</p>
                        <p className="font-medium">{order.items.length}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Tổng tiền</p>
                        <p className="font-medium">
                          {formatPrice(order.amount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Thanh toán</p>
                        <p className="font-medium">
                          {order.payment ? "Đã thanh toán" : "Chưa thanh toán"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Chưa có đơn hàng nào
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Người dùng này chưa đặt đơn hàng nào.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ratings Tab */}
      {activeTab === "ratings" && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-black">
              Lịch sử đánh giá
            </h3>
          </div>
          <div className="card-body">
            {ratings.length > 0 ? (
              <div className="space-y-4">
                {ratings.map((rating, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={`${
                                  i < rating.rating
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            ({rating.rating}/5)
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {formatDate(rating.date)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Sản phẩm ID</p>
                        <p className="font-medium text-sm">
                          {rating.productId}
                        </p>
                      </div>
                    </div>
                    {rating.comment && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700">
                          {rating.comment}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Star className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Chưa có đánh giá nào
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Người dùng này chưa đánh giá sản phẩm nào.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetail;
