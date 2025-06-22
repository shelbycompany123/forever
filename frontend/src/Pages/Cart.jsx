import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../Context/ShopContext";
import Title from "../Component/Title";
import CartTotal from "../Component/CartTotal";
import { assets } from "../assets/assets";

const Cart = () => {
  const { product_list, cartItems, updateQuantity, navigate, setOrderData } =
    useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    if (product_list.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item],
            });
          }
        }
      }
      setCartData(tempData);
      setIsLoading(false);
    }
  }, [cartItems, product_list]);

  // Handle item selection
  const handleItemSelect = (item) => {
    setSelectedItems((prev) => {
      const isSelected = prev.some(
        (selected) => selected._id === item._id && selected.size === item.size
      );

      if (isSelected) {
        return prev.filter(
          (selected) =>
            !(selected._id === item._id && selected.size === item.size)
        );
      } else {
        return [...prev, item];
      }
    });
  };

  // Handle select all items
  const handleSelectAll = () => {
    if (selectedItems.length === cartData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems([...cartData]);
    }
  };

  // Handle proceed to checkout
  const handleProceedToCheckout = () => {
    if (selectedItems.length === 0) {
      alert("Vui lòng chọn ít nhất một mặt hàng để thanh toán!");
      return;
    }

    // Set order data with selected items
    setOrderData(selectedItems);
    navigate("/place-order");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (cartData.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Giỏ hàng trống
          </h2>
          <p className="text-gray-600 mb-8">
            Bạn chưa có mặt hàng nào trong giỏ hàng. Hãy khám phá các sản phẩm
            của chúng tôi!
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-300 font-medium"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Title text1={"GIỎ"} text2={"HÀNG"} />
          <div className="flex items-center gap-2 mt-2">
            <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
            <p className="text-gray-600">
              Bạn có {cartData.length} mặt hàng trong giỏ hàng
              {selectedItems.length > 0 && (
                <span className="text-black font-medium">
                  {" "}
                  ({selectedItems.length} đã chọn)
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Sản phẩm trong giỏ
                  </h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={
                        selectedItems.length === cartData.length &&
                        cartData.length > 0
                      }
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                    />
                    <label className="text-sm font-medium text-gray-700">
                      Chọn tất cả ({selectedItems.length}/{cartData.length})
                    </label>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {cartData.map((item, index) => {
                  const productData = product_list.find(
                    (product) => product._id === item._id
                  );
                  const isSelected = selectedItems.some(
                    (selected) =>
                      selected._id === item._id && selected.size === item.size
                  );

                  return (
                    <div
                      key={index}
                      className={`p-6 transition-all duration-200 ${
                        isSelected
                          ? "bg-gray-50 border-l-4 border-black"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Checkbox for item selection */}
                        <div className="flex-shrink-0 pt-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleItemSelect(item)}
                            className="w-5 h-5 text-black border-gray-300 rounded focus:ring-black"
                          />
                        </div>

                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <img
                            className="w-20 h-20 object-cover rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200"
                            src={productData.image[0]}
                            alt={productData.name}
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-lg font-semibold text-gray-900">
                              {productData.name}
                            </h4>

                            {/* Remove Button */}
                            <button
                              onClick={() =>
                                updateQuantity(item._id, item.size, 0)
                              }
                              className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200"
                              title="Xóa sản phẩm"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>

                          {/* Product Info Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <span>💰</span>
                              <span className="font-semibold text-black">
                                ₹{productData.new_price}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>📦</span>
                              <span>Số lượng: {item.quantity}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>📏</span>
                              <span>Size: {item.size}</span>
                            </div>
                          </div>

                          {/* Total for this item */}
                          <div className="text-sm text-gray-500 mb-3">
                            Tổng: ₹
                            {(
                              productData.new_price * item.quantity
                            ).toLocaleString()}
                          </div>

                          {/* Quantity Control */}
                          <div className="flex items-center gap-3">
                            <label className="text-sm font-medium text-gray-700">
                              Số lượng:
                            </label>
                            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                              <button
                                onClick={() => {
                                  const newQuantity = Math.max(
                                    1,
                                    item.quantity - 1
                                  );
                                  updateQuantity(
                                    item._id,
                                    item.size,
                                    newQuantity
                                  );
                                }}
                                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                                disabled={item.quantity <= 1}
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M20 12H4"
                                  />
                                </svg>
                              </button>

                              <input
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (
                                    value === "" ||
                                    value === "0" ||
                                    value > productData.sizes[item.size]
                                  ) {
                                    return;
                                  }
                                  updateQuantity(
                                    item._id,
                                    item.size,
                                    Number(value)
                                  );
                                }}
                                className="w-16 text-center py-2 border-0 focus:ring-0 focus:outline-none"
                                type="number"
                                min={1}
                                max={productData.sizes[item.size]}
                                value={item.quantity}
                              />

                              <button
                                onClick={() => {
                                  const newQuantity = Math.min(
                                    productData.sizes[item.size],
                                    item.quantity + 1
                                  );
                                  updateQuantity(
                                    item._id,
                                    item.size,
                                    newQuantity
                                  );
                                }}
                                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                                disabled={
                                  item.quantity >= productData.sizes[item.size]
                                }
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                  />
                                </svg>
                              </button>
                            </div>

                            <span className="text-sm text-gray-500">
                              {productData.sizes[item.size]} có sẵn
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="border border-gray-200 rounded-lg sticky top-8">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">
                  Tóm tắt đơn hàng
                </h3>
              </div>

              <div className="p-6">
                <CartTotal selectedItems={selectedItems} />

                <div className="mt-6">
                  {selectedItems.length === 0 && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800 text-center">
                        Vui lòng chọn ít nhất một mặt hàng để thanh toán
                      </p>
                    </div>
                  )}
                  <button
                    onClick={handleProceedToCheckout}
                    disabled={selectedItems.length === 0}
                    className={`w-full py-4 px-6 rounded-lg font-semibold transition-colors duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                      selectedItems.length === 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-black text-white hover:bg-gray-800"
                    }`}
                  >
                    Tiến hành thanh toán ({selectedItems.length} sản phẩm)
                  </button>
                </div>

                <div className="mt-4 text-center">
                  <button
                    onClick={() => navigate("/")}
                    className="text-gray-600 hover:text-black transition-colors duration-200 text-sm font-medium"
                  >
                    ← Tiếp tục mua sắm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
