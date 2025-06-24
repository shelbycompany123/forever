import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App.jsx";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import {
  Package,
  User,
  Phone,
  MapPin,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Edit,
} from "lucide-react";

const OrderDetail = ({ token }) => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchOrderDetail = async () => {
    if (!token || !orderId) {
      return null;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `${backendUrl}/api/order/detail/${orderId}`,
        { headers: { token } }
      );
      if (response.data.success) {
        setOrder(response.data.order);
      } else {
        toast.error(response.data.message);
        navigate("/orders");
      }
    } catch (error) {
      toast.error("Không thể tải thông tin đơn hàng");
      navigate("/orders");
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

  const statusHandler = async (event) => {
    try {
      setUpdating(true);
      const response = await axios.post(
        backendUrl + "/api/order/status",
        { orderId, status: event.target.value },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success("Cập nhật trạng thái thành công");
        await fetchOrderDetail();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setUpdating(false);
    }
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
      case "dang_dong_goi":
        return {
          text: "Đang đóng gói",
          color: "status-processing",
          icon: Package,
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

  useEffect(() => {
    fetchOrderDetail();
  }, [token, orderId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="card">
        <div className="card-body text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Không tìm thấy đơn hàng
          </h3>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);
  const paymentInfo = getPaymentStatusInfo(order.payment);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="card">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/orders")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-black">
                  Chi tiết đơn hàng #{order._id.slice(-8)}
                </h1>
                <p className="text-gray-600 mt-1">
                  Thông tin chi tiết và cập nhật trạng thái đơn hàng
                </p>
              </div>
            </div>
            <div className="bg-gray-100 px-4 py-2 rounded-lg border border-gray-200">
              <span className="text-black font-semibold">
                {formatCurrency(order.amount)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <div className="card h-72">
            <div className="card-header">
              <h3 className="font-semibold text-black flex items-center gap-2">
                <User size={20} />
                Thông Tin Khách Hàng
              </h3>
            </div>
            <div className="card-body">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Họ và tên</p>
                    <p className="font-semibold text-black text-lg">
                      {order.address.firstName} {order.address.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Số điện thoại</p>
                    <p className="font-semibold text-black text-lg flex items-center gap-2">
                      <Phone size={16} />
                      {order.address.phone}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">Địa chỉ giao hàng</p>
                    <p className="font-semibold text-black flex items-start gap-2">
                      <MapPin size={16} className="mt-1 flex-shrink-0" />
                      <span>
                        {order.address.street}, {order.address.ward},{" "}
                        {order.address.district}, {order.address.province}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products List */}
          <div className="card">
            <div className="card-header">
              <h3 className="font-semibold text-black flex items-center gap-2">
                <Package size={20} />
                Sản Phẩm Đặt Hàng ({order.items.length} sản phẩm)
              </h3>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image[0]}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/80x80?text=No+Image";
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-black text-lg truncate">
                            {item.name}
                          </p>
                          <p className="text-gray-600">Size: {item.size}</p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-bold text-black text-lg">
                            {formatCurrency(item.selling_price)}
                          </p>
                          <p className="text-gray-600">
                            Số lượng: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                          Tổng:{" "}
                          <span className="font-semibold text-black">
                            {formatCurrency(item.selling_price * item.quantity)}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Order Details & Status */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="card h-72">
            <div className="card-header">
              <h3 className="font-semibold text-black flex items-center gap-2">
                <CreditCard size={20} />
                Tóm Tắt Đơn Hàng
              </h3>
            </div>
            <div className="card-body">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã đơn hàng:</span>
                  <span className="font-medium text-black">
                    #{order._id.slice(-8)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày đặt:</span>
                  <span className="font-medium text-black">
                    {new Date(order.date).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phương thức thanh toán:</span>
                  <span className="font-medium text-black">
                    {order.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Trạng thái thanh toán:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${paymentInfo.color}`}
                  >
                    {paymentInfo.text}
                  </span>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-black">
                      Tổng tiền:
                    </span>
                    <span className="text-lg font-bold text-black">
                      {formatCurrency(order.amount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Management */}
          <div className="card h-56">
            <div className="card-header">
              <h3 className="font-semibold text-black flex items-center gap-2">
                <Edit size={20} />
                Cập Nhật Trạng Thái
              </h3>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${statusInfo.color}`}
                  >
                    {statusInfo.text}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thay đổi trạng thái:
                  </label>
                  <select
                    onChange={statusHandler}
                    value={order.status}
                    disabled={
                      order.status === "da_giao" ||
                      order.status === "da_huy" ||
                      updating
                    }
                    className="form-select w-full"
                  >
                    <option value="chua_xac_nhan">Chưa xác nhận</option>
                    <option value="da_xac_nhan">Đã xác nhận</option>
                    <option value="dang_dong_goi">Đang đóng gói</option>
                    <option value="dang_giao">Đang giao hàng</option>
                    <option value="da_giao">Đã giao hàng</option>
                    <option value="da_huy">Đã hủy</option>
                  </select>
                </div>
                {updating && (
                  <div className="flex items-center justify-center py-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
                    <span className="ml-2 text-sm text-gray-600">
                      Đang cập nhật...
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
