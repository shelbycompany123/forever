import axios from "axios";
import { useContext, useState, useEffect, useCallback } from "react";
import { ShopContext } from "../Context/ShopContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import locationData from "../data/location.json";

const UpdateUserInfo = () => {
  const { backendUrl } = useContext(ShopContext);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const [user, setUser] = useState({ name: "", phone: "", address: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // State cho dropdown địa chỉ
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [detailAddress, setDetailAddress] = useState("");
  const [initialWard, setInitialWard] = useState(""); // Lưu ward từ địa chỉ ban đầu

  // Hàm parse địa chỉ từ string
  const parseAddress = useCallback((addressString) => {
    if (!addressString)
      return { detail: "", ward: "", district: "", province: "" };

    const parts = addressString
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);

    if (parts.length === 4) {
      return {
        detail: parts[0],
        ward: parts[1],
        district: parts[2],
        province: parts[3],
      };
    } else if (parts.length === 3) {
      return {
        detail: "",
        ward: parts[0],
        district: parts[1],
        province: parts[2],
      };
    } else if (parts.length === 2) {
      return {
        detail: "",
        ward: "",
        district: parts[0],
        province: parts[1],
      };
    } else if (parts.length === 1) {
      return {
        detail: "",
        ward: "",
        district: "",
        province: parts[0],
      };
    }

    return { detail: "", ward: "", district: "", province: "" };
  }, []);

  // Hàm tạo địa chỉ string từ các component
  const buildAddressString = useCallback((detail, ward, district, province) => {
    const parts = [];
    if (detail) parts.push(detail);
    if (ward) parts.push(ward);
    if (district) parts.push(district);
    if (province) parts.push(province);
    return parts.join(", ");
  }, []);

  // Hàm helper để tìm ward chính xác
  const findWardByName = useCallback((wardName, wardsList) => {
    if (!wardName || !wardsList.length) return null;
    const normalizedWardName = wardName.trim();
    return wardsList.find((w) => w.name.trim() === normalizedWardName);
  }, []);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      if (!userId || !token) {
        toast.error("Vui lòng đăng nhập lại");
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get(
          `${backendUrl}/api/user/profile/${userId}`,
          {
            headers: { token },
          }
        );

        if (res.data.success) {
          const userData = res.data.user;
          setUser({
            name: userData.name || "",
            phone: userData.phone || "",
            address: userData.address || "",
          });

          // Parse địa chỉ nếu có
          if (userData.address) {
            const parsedAddress = parseAddress(userData.address);
            setDetailAddress(parsedAddress.detail);
            setDistrict(parsedAddress.district);
            setProvince(parsedAddress.province);
            setInitialWard(parsedAddress.ward);
            // Không set ward ngay, sẽ được set sau khi wards được load
            // setWard(parsedAddress.ward);
          }
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        if (err.response?.status === 401) {
          toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
          navigate("/login");
        } else {
          toast.error("Lỗi lấy thông tin người dùng");
        }
      }
    };

    fetchUser();
  }, [backendUrl, userId, token, navigate, parseAddress]);

  // Khi chọn tỉnh, cập nhật danh sách quận
  useEffect(() => {
    if (province) {
      const foundProvince = locationData.find((p) => p.name === province);
      if (foundProvince) {
        setDistricts(foundProvince.districts || []);
        // Reset district và ward nếu không còn hợp lệ
        if (!foundProvince.districts?.find((d) => d.name === district)) {
          setDistrict("");
          setWard("");
          setWards([]);
        }
      } else {
        setDistricts([]);
        setDistrict("");
        setWard("");
        setWards([]);
      }
    } else {
      setDistricts([]);
      setDistrict("");
      setWard("");
      setWards([]);
    }
  }, [province, district]);

  // Khi chọn quận, cập nhật danh sách phường
  useEffect(() => {
    if (district && districts.length > 0) {
      const foundDistrict = districts.find((d) => d.name === district);
      if (foundDistrict) {
        const newWards = foundDistrict.wards || [];
        setWards(newWards);
        // Reset ward nếu không còn hợp lệ trong district mới
        const wardExists = findWardByName(ward, newWards);
        if (!wardExists && ward) {
          setWard("");
        }
      } else {
        setWards([]);
        setWard("");
      }
    } else {
      setWards([]);
      setWard("");
    }
  }, [district, districts, findWardByName]);

  // Reset ward nếu không hợp lệ trong danh sách wards hiện tại
  useEffect(() => {
    if (ward && wards.length > 0) {
      const isValidWard = findWardByName(ward, wards);
      if (!isValidWard) {
        setWard("");
      }
    }
  }, [wards, ward, findWardByName]);

  // Tự động chọn ward đầu tiên nếu chỉ có một ward
  useEffect(() => {
    if (wards.length === 1 && !ward) {
      setWard(wards[0].name);
    }
  }, [wards, ward]);

  // Đảm bảo thứ tự load đúng: province -> districts -> wards -> ward
  useEffect(() => {
    if (province && district && wards.length > 0 && initialWard && !ward) {
      const foundWard = findWardByName(initialWard, wards);
      if (foundWard) {
        setWard(foundWard.name);
        setInitialWard(""); // Clear initialWard sau khi đã set
      }
    }
  }, [province, district, wards, initialWard, ward, findWardByName]);

  // Đảm bảo province và district được load đúng thứ tự
  useEffect(() => {
    if (province && !districts.length) {
      const foundProvince = locationData.find((p) => p.name === province);
      if (foundProvince) {
        setDistricts(foundProvince.districts || []);
      }
    }
  }, [province, districts.length]);

  // Đảm bảo district được load đúng thứ tự
  useEffect(() => {
    if (district && districts.length > 0 && !wards.length) {
      const foundDistrict = districts.find((d) => d.name === district);
      if (foundDistrict) {
        setWards(foundDistrict.wards || []);
      }
    }
  }, [district, districts, wards.length]);

  // Cập nhật địa chỉ khi các component thay đổi
  useEffect(() => {
    const addressString = buildAddressString(
      detailAddress,
      ward,
      district,
      province
    );
    setUser((prev) => ({ ...prev, address: addressString }));
  }, [detailAddress, ward, district, province, buildAddressString]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleDetailAddressChange = (e) => {
    setDetailAddress(e.target.value);
  };

  // Validation
  const validateForm = () => {
    if (!user.name.trim()) {
      toast.error("Vui lòng nhập tên");
      return false;
    }

    if (user.phone && !/^[0-9]{10,11}$/.test(user.phone.replace(/\s/g, ""))) {
      toast.error("Số điện thoại không hợp lệ");
      return false;
    }

    if (!user.address.trim()) {
      toast.error("Vui lòng nhập địa chỉ");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await axios.put(
        `${backendUrl}/api/user/update-info`,
        { ...user },
        { headers: { token } }
      );

      if (res.data.success) {
        toast.success("Cập nhật thông tin thành công!");
        navigate("/profile");
      } else {
        toast.error(res.data.message || "Cập nhật thất bại");
      }
    } catch (err) {
      console.error("Error updating user:", err);
      if (err.response?.status === 401) {
        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
        navigate("/login");
      } else if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Lỗi cập nhật thông tin");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-2xl font-light text-gray-900 mb-2">
            Chỉnh sửa thông tin
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2 block">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleChange}
                className="w-full px-0 py-2 border-b border-gray-200 focus:border-black focus:outline-none text-gray-900"
                placeholder="Nhập họ và tên đầy đủ"
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2 block">
                Số điện thoại
              </label>
              <input
                type="tel"
                name="phone"
                value={user.phone}
                onChange={handleChange}
                className="w-full px-0 py-2 border-b border-gray-200 focus:border-black focus:outline-none text-gray-900"
                placeholder="Nhập số điện thoại (10-11 số)"
              />
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2 block">
                Địa chỉ chi tiết
              </label>
              <input
                type="text"
                name="detailAddress"
                value={detailAddress}
                onChange={handleDetailAddressChange}
                className="w-full px-0 py-2 border-b border-gray-200 focus:border-black focus:outline-none text-gray-900"
                placeholder="Số nhà, tên đường, khu phố..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2 block">
                  Tỉnh/Thành phố
                </label>
                <select
                  className="w-full px-0 py-2 border-b border-gray-200 focus:border-black focus:outline-none text-gray-900 bg-transparent"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                >
                  <option value="">Chọn tỉnh/thành phố</option>
                  {locationData.map((p) => (
                    <option key={p.code} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2 block">
                  Quận/Huyện
                </label>
                <select
                  className="w-full px-0 py-2 border-b border-gray-200 focus:border-black focus:outline-none text-gray-900 bg-transparent disabled:text-gray-400"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  disabled={!province}
                >
                  <option value="">Chọn quận/huyện</option>
                  {districts.map((d) => (
                    <option key={d.code} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2 block">
                  Phường/Xã
                </label>
                <select
                  className="w-full px-0 py-2 border-b border-gray-200 focus:border-black focus:outline-none text-gray-900 bg-transparent disabled:text-gray-400"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  disabled={!district}
                >
                  <option value="">Chọn phường/xã</option>
                  {wards.map((w) => (
                    <option key={w.code} value={w.name}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Address Preview */}
            <div className="pt-4">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2 block">
                Địa chỉ hoàn chỉnh
              </label>
              <input
                type="text"
                name="address"
                disabled
                value={user.address}
                className="w-full px-0 py-2 border-b border-gray-200 text-gray-900 bg-transparent"
                placeholder="Địa chỉ sẽ được tạo tự động"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-8 space-y-3">
            <button
              type="submit"
              className="block w-full bg-black text-white py-3 px-6 text-center text-sm font-medium hover:bg-gray-800 transition-colors duration-200"
              disabled={loading}
            >
              {loading ? "Đang cập nhật..." : "Cập nhật thông tin"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="block w-full bg-white text-black py-3 px-6 text-center text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
            >
              Quay lại
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUserInfo;
