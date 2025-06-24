import React, { useEffect, useState } from "react";
import { backendUrl } from "../App";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  Trash2,
  Users,
  Search,
  Mail,
  Phone,
  MapPin,
  User,
  Eye,
} from "lucide-react";

const ListUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(backendUrl + "/api/user/listuser");
      if (response.data.success) {
        setUsers(response.data.users);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      try {
        const response = await axios.delete(
          backendUrl + `/api/user/delete/${userId}`
        );
        if (response.data.success) {
          toast.success("Xóa người dùng thành công");
          await fetchUsers();
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  // Filter users based on search
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm)
  );

  useEffect(() => {
    fetchUsers();
  }, []);

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
                Quản lý người dùng
              </h1>
              <p className="text-gray-600 mt-1">
                Quản lý tất cả người dùng trong cửa hàng
              </p>
            </div>
            <div className="bg-gray-100 px-4 py-2 rounded-lg border border-gray-200">
              <span className="text-black font-semibold">
                Tổng: {users.length} người dùng
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="card">
        <div className="card-body">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10"
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-black">
            Kết quả: {filteredUsers.length} người dùng
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Avatar</th>
                <th>Thông tin</th>
                <th>Liên hệ</th>
                <th>Địa chỉ</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="font-medium text-gray-700">{index + 1}</td>
                  <td>
                    <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <p className="font-medium text-black">
                        {user.name || "Chưa cập nhật"}
                      </p>
                      <p className="text-sm text-gray-600">
                        ID: {user._id?.slice(-8)}
                      </p>
                    </div>
                  </td>
                  <td>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail size={14} className="text-gray-400" />
                        <span className="text-gray-700">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone size={14} className="text-gray-400" />
                        <span className="text-gray-700">
                          {user.phone || "Chưa cập nhật"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <MapPin size={14} className="text-gray-400" />
                      <span>{user.address || "Chưa cập nhật"}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/user/${user._id}`)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa người dùng"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Không tìm thấy người dùng
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Thử thay đổi từ khóa tìm kiếm.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListUser;
