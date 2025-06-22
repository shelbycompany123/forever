import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App.jsx";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  Package,
  User,
  Calendar,
  Phone,
  MapPin,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const navigate = useNavigate();

  const fetchAllOrders = async () => {
    if (!token) {
      return null;
    }

    try {
      setLoading(true);
      const response = await axios.get(backendUrl + "/api/order/list", {
        headers: { token },
      });
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (amount) {
      const formatted = amount.toLocaleString("vi-VN");
      return formatted.replace(/\./g, ",") + " VNĐ";
    }
    return "0 VNĐ";
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "chua_xac_nhan":
        return { text: "Chưa xác nhận", color: "status-pending", icon: Clock };
      case "da_xac_nhan":
        return {
          text: "Đã xác nhận",
          color: "status-processing",
          icon: CheckCircle,
        };

      case "dang_giao":
        return {
          text: "Đang giao hàng",
          color: "status-processing",
          icon: Package,
        };
      case "da_giao":
        return {
          text: "Đã giao hàng",
          color: "status-success",
          icon: CheckCircle,
        };
      case "da_huy":
        return { text: "Đã hủy", color: "status-cancelled", icon: XCircle };
      default:
        return { text: "Không xác định", color: "status-pending", icon: Clock };
    }
  };

  const getPaymentStatusInfo = (payment) => {
    return payment
      ? { text: "Đã thanh toán", color: "status-success" }
      : { text: "Chờ thanh toán", color: "status-pending" };
  };

  // Filter orders based on status
  const filteredOrders = orders.filter(
    (order) => filterStatus === "" || order.status === filterStatus
  );

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="card">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-black">
                Quản lý đơn hàng
              </h1>
              <p className="text-gray-600 mt-1">
                Theo dõi và quản lý tất cả đơn hàng
              </p>
            </div>
            <div className="bg-gray-100 px-4 py-2 rounded-lg border border-gray-200">
              <span className="text-black font-semibold">
                Tổng: {orders.length} đơn hàng
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="card">
        <div className="card-body">
          <div className="flex items-center space-x-4 whitespace-nowrap">
            <label className="text-sm font-medium text-gray-700">
              Lọc theo trạng thái:
            </label>
            <div className="w-full">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="form-select "
              >
                <option value="">Tất cả đơn hàng</option>
                <option value="chua_xac_nhan">Chưa xác nhận</option>
                <option value="da_xac_nhan">Đã xác nhận</option>
                <option value="dang_giao">Đang giao hàng</option>
                <option value="da_giao">Đã giao hàng</option>
                <option value="da_huy">Đã hủy</option>
              </select>
            </div>
            <span className="text-sm text-gray-600">
              Hiển thị: {filteredOrders.length} đơn hàng
            </span>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map((order, index) => {
            const statusInfo = getStatusInfo(order.status);
            const paymentInfo = getPaymentStatusInfo(order.payment);
            const StatusIcon = statusInfo.icon;

            return (
              <div
                key={index}
                className="card hover:shadow-md transition-shadow"
              >
                {/* Order Header */}
                <div className="card-header">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                        <Package className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-black">
                          Đơn hàng #{order._id.slice(-8)}
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(order.date).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-bold text-black">
                          {formatCurrency(order.amount)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.items.length} sản phẩm
                        </p>
                      </div>
                      <button
                        onClick={() => navigate(`/orders/${order._id}`)}
                        className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
                      >
                        <Eye size={16} />
                        Chi tiết
                      </button>
                    </div>
                  </div>
                </div>

                {/* Order Content */}
                <div className="card-body">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Customer & Items Info */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-black mb-2 flex items-center gap-2">
                          <User size={16} />
                          Thông Tin Khách Hàng
                        </h4>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <p className="font-medium text-black">
                            {order.address.firstName} {order.address.lastName}
                          </p>
                          <div className="text-sm text-gray-600 mt-2 space-y-1">
                            <p className="flex items-center gap-2">
                              <MapPin size={14} />
                              {order.address.street}
                            </p>
                            <p>
                              {order.address.ward}, {order.address.district},{" "}
                              {order.address.province}
                            </p>
                            <p className="font-medium flex items-center gap-2">
                              <Phone size={14} />
                              {order.address.phone}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-black mb-2 flex items-center gap-2">
                          <Package size={16} />
                          Sản Phẩm Đặt Hàng
                        </h4>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="space-y-3">
                            {order.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200"
                              >
                                <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                  <img
                                    src={item.image[0]}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-start">
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-black truncate">
                                        {item.name}
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        Size: {item.size}
                                      </p>
                                    </div>
                                    <div className="text-right ml-2">
                                      <p className="font-semibold text-black">
                                        {formatCurrency(item.new_price)}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        x{item.quantity}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="mt-1">
                                    <p className="text-sm text-gray-600">
                                      Tổng:{" "}
                                      {formatCurrency(
                                        item.new_price * item.quantity
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-black mb-2 flex items-center gap-2">
                          <CreditCard size={16} />
                          Chi Tiết Đơn Hàng
                        </h4>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Phương thức thanh toán:
                            </span>
                            <span className="font-medium text-black">
                              {order.paymentMethod}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">
                              Trạng thái thanh toán:
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${paymentInfo.color}`}
                            >
                              {paymentInfo.text}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Ngày đặt hàng:
                            </span>
                            <span className="font-medium text-black">
                              {new Date(order.date).toLocaleDateString("vi-VN")}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-black mb-2 flex items-center gap-2">
                          <StatusIcon size={16} />
                          Trạng Thái Đơn Hàng
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-3 py-2 rounded-lg text-sm font-medium ${statusInfo.color}`}
                            >
                              {statusInfo.text}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Nhấn "Chi tiết" để cập nhật trạng thái đơn hàng
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {filteredOrders.length === 0 && (
        <div className="card">
          <div className="card-body text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Không có đơn hàng nào
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {filterStatus
                ? "Không có đơn hàng nào với trạng thái này."
                : "Chưa có đơn hàng nào được đặt."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
