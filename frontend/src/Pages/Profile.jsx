import axios from 'axios';
import { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../Context/ShopContext';

const Profile = () => {
  const { backendUrl } = useContext(ShopContext);
  const userId = localStorage.getItem('userId');
  const [user, setUser] = useState({});

  const getUser = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/profile/${userId}`);
      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Thông tin cá nhân</h2>
      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <div className="flex items-center space-x-4">
          <div className="avatar">
            <div className="w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img src={user.avatar || 'https://i.pravatar.cc/150?u=profile'} alt="avatar" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold">{user.name || 'Chưa có tên'}</h3>
            <p className="text-gray-500">{user.email || 'Chưa có email'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-500">Số điện thoại</label>
            <p className="font-medium">{user.phone || 'Chưa cập nhật'}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Địa chỉ</label>
            <p className="font-medium">{user.address || 'Chưa cập nhật'}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Ngày tạo</label>
            <p className="font-medium">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Không rõ'}</p>
          </div>
        </div>

        <button className="btn btn-primary mt-4">Chỉnh sửa thông tin</button>
      </div>
    </div>
  );
};

export default Profile;
