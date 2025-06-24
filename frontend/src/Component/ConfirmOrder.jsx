import React from "react";

const ConfirmOrder = ({ open, onClose, onConfirm, orderInfo }) => {
  if (!open) return null;
  const { address, items, amount, method, formatCurrency } = orderInfo;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <h2 className="text-xl font-bold mb-4 text-center">
          Xác nhận đơn hàng
        </h2>
        <div className="mb-4">
          <h3 className="font-semibold mb-1">Địa chỉ giao hàng</h3>
          <div className="text-sm text-gray-700">
            {address.firstName} {address.lastName}
            <br />
            {address.email}
            <br />
            {address.phone}
            <br />
            {address.street}, {address.ward}, {address.district},{" "}
            {address.province}
          </div>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold mb-1">Sản phẩm</h3>
          <div className="max-h-32 overflow-y-auto space-y-2">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-sm border-b pb-1"
              >
                <img
                  src={item.image[0]}
                  alt={item.name}
                  className="w-8 h-8 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <span className="font-medium">{item.name}</span>
                  <span className="ml-2 text-xs text-gray-500">
                    Kích thước: {item.size} | SL: {item.quantity}
                  </span>
                </div>
                <span className="font-semibold">
                  {formatCurrency
                    ? formatCurrency(item.selling_price * item.quantity)
                    : item.selling_price * item.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-4 flex justify-between items-center">
          <span className="font-semibold">Tổng tiền:</span>
          <span className="text-lg font-bold">
            {formatCurrency ? formatCurrency(amount) : amount}
          </span>
        </div>
        <div className="mb-4">
          <span className="font-semibold">Phương thức thanh toán:</span>{" "}
          {method === "cod" ? "Thanh toán khi nhận hàng" : method}
        </div>
        <div className="flex gap-3 justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Quay lại chỉnh sửa
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800"
          >
            Xác nhận đặt hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmOrder;
