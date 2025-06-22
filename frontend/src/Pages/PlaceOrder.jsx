import React, { useContext, useState, useEffect } from "react";
import Title from "../Component/Title";
import CartTotal from "../Component/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../Context/ShopContext";
import toast from "react-hot-toast";
import axios from "axios";

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const [isLoading, setIsLoading] = useState(false);
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    delivery_fee,
    setCartItems,
    product_list,
    orderData,
  } = useContext(ShopContext);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    ward: "",
    district: "",
    province: "",
    phone: "",
  });

  // Check if orderData is empty
  useEffect(() => {
    if (orderData.length === 0) {
      toast.error("Không có mặt hàng nào được chọn để đặt hàng!");
      navigate("/cart");
    }
  }, [orderData, navigate]);

  const getSelectedItemsAmount = () => {
    let totalAmount = 0;
    orderData.forEach((item) => {
      const productData = product_list.find(
        (product) => product._id === item._id
      );
      if (productData) {
        totalAmount += productData.new_price * item.quantity;
      }
    });
    return totalAmount;
  };

  // Load user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const res = await axios.get(`${backendUrl}/api/user/profile/${userId}`);
        if (res.data.success) {
          const user = res.data.user;
          // Tách tên
          let firstName = "";
          let lastName = "";
          if (user.name) {
            const nameParts = user.name.trim().split(" ");
            firstName = nameParts.slice(0, -1).join(" ");
            lastName = nameParts.slice(-1).join(" ");
          }
          // Tách địa chỉ nếu đúng định dạng
          let street = "",
            ward = "",
            district = "",
            province = "";
          if (user.address) {
            const parts = user.address.split(",").map((s) => s.trim());
            if (parts.length >= 4) {
              street = parts[0];
              ward = parts[1];
              district = parts[2];
              province = parts[3];
            } else if (parts.length === 3) {
              street = parts[0];
              ward = parts[1];
              district = parts[2];
            } else {
              street = user.address;
            }
          }
          setFormData((data) => ({
            ...data,
            firstName,
            lastName,
            email: user.email || "",
            phone: user.phone || "",
            street,
            ward,
            district,
            province,
          }));
        }
      } catch (err) {
        // Không cần toast ở đây
      }
    };
    fetchUser();
  }, [backendUrl]);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setFormData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      let orderItems = [];

      // Use orderData (selected items) instead of all cartItems
      orderData.forEach((item) => {
        const itemInfo = structuredClone(
          product_list.find((product) => product._id === item._id)
        );
        if (itemInfo) {
          itemInfo.size = item.size;
          itemInfo.quantity = item.quantity;
          orderItems.push(itemInfo);
        }
      });

      let orderDataToSend = {
        address: formData,
        items: orderItems,
        amount: getSelectedItemsAmount() + delivery_fee,
      };

      switch (method) {
        // API Calls for COD
        case "cod":
          const response = await axios.post(
            backendUrl + "/api/order/place",
            orderDataToSend,
            { headers: { token } }
          );

          if (response.data.success) {
            // Remove selected items from cart
            let updatedCartItems = structuredClone(cartItems);
            orderData.forEach((item) => {
              if (
                updatedCartItems[item._id] &&
                updatedCartItems[item._id][item.size]
              ) {
                delete updatedCartItems[item._id][item.size];
                if (Object.keys(updatedCartItems[item._id]).length === 0) {
                  delete updatedCartItems[item._id];
                }
              }
            });
            setCartItems(updatedCartItems);
            toast.success("Order placed successfully!");
            navigate("/orders");
          } else {
            toast.error(response.data.message);
          }
          break;

        case "stripe":
          const responseStripe = await axios.post(
            backendUrl + "/api/order/stripe",
            orderDataToSend,
            { headers: { token } }
          );
          if (responseStripe.data.success) {
            const { session_url } = responseStripe.data;
            window.location.replace(session_url);
          } else {
            toast.error(responseStripe.data.message);
          }
          break;

        default:
          break;
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Title text1={"HOÀN"} text2={"THÀNH ĐƠN HÀNG"} />
          <div className="flex items-center gap-2 mt-2">
            <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
            <p className="text-gray-600">
              Điền thông tin giao hàng và chọn phương thức thanh toán
            </p>
          </div>
        </div>

        <form
          onSubmit={onSubmitHandler}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Left Side - Delivery Information */}
          <div className="lg:col-span-2">
            <div className="border border-gray-200 rounded-lg p-8 mb-8">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Thông tin giao hàng
                  </h2>
                  <p className="text-gray-600">
                    Nhập thông tin địa chỉ giao hàng
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên
                  </label>
                  <input
                    required
                    onChange={onChangeHandler}
                    name="firstName"
                    value={formData.firstName}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                    type="text"
                    placeholder="Nhập tên của bạn"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ
                  </label>
                  <input
                    required
                    onChange={onChangeHandler}
                    name="lastName"
                    value={formData.lastName}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                    type="text"
                    placeholder="Nhập họ của bạn"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Địa chỉ email
                  </label>
                  <input
                    required
                    onChange={onChangeHandler}
                    name="email"
                    value={formData.email}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                    type="email"
                    placeholder="Nhập địa chỉ email"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Địa chỉ đường
                  </label>
                  <input
                    required
                    onChange={onChangeHandler}
                    name="street"
                    value={formData.street}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                    type="text"
                    placeholder="Nhập địa chỉ đường"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Xã/Phường
                  </label>
                  <input
                    required
                    onChange={onChangeHandler}
                    name="ward"
                    value={formData.ward}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                    type="text"
                    placeholder="Nhập xã/phường"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quận/Huyện
                  </label>
                  <input
                    required
                    onChange={onChangeHandler}
                    name="district"
                    value={formData.district}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                    type="text"
                    placeholder="Nhập quận/huyện"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tỉnh/Thành phố
                  </label>
                  <input
                    required
                    onChange={onChangeHandler}
                    name="province"
                    value={formData.province}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                    type="text"
                    placeholder="Nhập tỉnh/thành phố"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại
                  </label>
                  <input
                    required
                    onChange={onChangeHandler}
                    name="phone"
                    value={formData.phone}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                    type="tel"
                    placeholder="Nhập số điện thoại"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Order Summary & Payment */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Order Summary */}
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                    <svg
                      className="w-4 h-4 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Tóm tắt đơn hàng
                  </h3>
                </div>

                {/* Selected Items List */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Sản phẩm đã chọn ({orderData.length})
                  </h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {orderData.map((item, index) => {
                      const productData = product_list.find(
                        (product) => product._id === item._id
                      );
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
                        >
                          <img
                            src={productData?.image[0]}
                            alt={productData?.name}
                            className="w-8 h-8 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {productData?.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              Kích thước: {item.size} | Số lượng:{" "}
                              {item.quantity}
                            </p>
                          </div>
                          <span className="text-sm font-semibold text-gray-900">
                            ₹{productData?.new_price * item.quantity}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <CartTotal selectedItems={orderData} />
              </div>

              {/* Payment Method */}
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                    <svg
                      className="w-4 h-4 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Phương thức thanh toán
                  </h3>
                </div>

                <div className="space-y-3">
                  <div
                    onClick={() => setMethod("stripe")}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      method === "stripe"
                        ? "border-black bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 ${
                        method === "stripe"
                          ? "border-black bg-black"
                          : "border-gray-300"
                      }`}
                    >
                      {method === "stripe" && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <img
                      className="h-6 mr-3"
                      src={assets.stripe_logo}
                      alt="Stripe"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Thẻ tín dụng (Stripe)
                    </span>
                  </div>

                  <div
                    onClick={() => setMethod("razorpay")}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      method === "razorpay"
                        ? "border-black bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 ${
                        method === "razorpay"
                          ? "border-black bg-black"
                          : "border-gray-300"
                      }`}
                    >
                      {method === "razorpay" && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <img
                      className="h-6 mr-3"
                      src={assets.razorpay_logo}
                      alt="Razorpay"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Thanh toán khi nhận hàng
                    </span>
                  </div>

                  <div
                    onClick={() => setMethod("cod")}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      method === "cod"
                        ? "border-black bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 ${
                        method === "cod"
                          ? "border-black bg-black"
                          : "border-gray-300"
                      }`}
                    >
                      {method === "cod" && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                      <svg
                        className="w-3 h-3 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      Cash on Delivery
                    </span>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-6 bg-black text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Đang xử lý...
                    </div>
                  ) : (
                    "Đặt hàng"
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Bằng việc đặt hàng, bạn đồng ý với các điều khoản và điều kiện
                  của chúng tôi
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlaceOrder;
