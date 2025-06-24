import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../Context/ShopContext";
import { Link } from "react-router-dom";

const Profile = () => {
  const { backendUrl } = useContext(ShopContext);
  const userId = localStorage.getItem("userId");
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  const getUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${backendUrl}/api/user/profile/${userId}`
      );
      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-black mx-auto mb-2"></div>
          <p className="text-sm text-gray-500">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-2xl font-light text-gray-900 mb-2">
            Hồ sơ cá nhân
          </h1>
        </div>

        {/* Profile Card */}
        <div className="space-y-8">
          {/* Avatar & Basic Info */}
          <div className="text-center">
            <div className="inline-block relative mb-4">
              <img
                src={user.avatar || "https://i.pravatar.cc/150?u=profile"}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border border-gray-200"
              />
            </div>
            <h2 className="text-xl font-medium text-gray-900 mb-1">
              {user.name || "Chưa có tên"}
            </h2>
            <p className="text-gray-500 text-sm">
              {user.email || "Chưa có email"}
            </p>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <div className="border-b border-gray-100 pb-4">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2 block">
                Số điện thoại
              </label>
              <p className="text-gray-900">{user.phone || "Chưa cập nhật"}</p>
            </div>

            <div className="border-b border-gray-100 pb-4">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2 block">
                Địa chỉ
              </label>
              <p className="text-gray-900">{user.address || "Chưa cập nhật"}</p>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2 block">
                Thành viên từ
              </label>
              <p className="text-gray-900">
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("vi-VN")
                  : "Không rõ"}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-8 space-y-3">
            <Link
              to="/update-user-info"
              className="block w-full bg-black text-white py-3 px-6 text-center text-sm font-medium hover:bg-gray-800 transition-colors duration-200"
            >
              Chỉnh sửa thông tin
            </Link>

            <Link
              to="/orders"
              className="block w-full bg-white text-black py-3 px-6 text-center text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
            >
              Xem đơn hàng
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
