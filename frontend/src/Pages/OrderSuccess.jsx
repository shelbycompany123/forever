import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

const OrderSuccess = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 bg-gray-50">
      <div className="border border-gray-400 rounded-full p-6 mb-6 bg-white">
        <CheckCircle2 className="w-16 h-16 text-gray-700" strokeWidth={1.2} />
      </div>
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2 text-center tracking-tight">
        Đặt hàng thành công!
      </h2>
      <p className="text-gray-600 mb-8 text-center max-w-md text-base">
        Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi.
        <br />
        Đơn hàng của bạn đã được ghi nhận và sẽ được xử lý trong thời gian sớm
        nhất.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <div className="w-full">
          <Link
            to="/"
            className="btn w-full border border-gray-400 bg-white text-gray-900 hover:bg-gray-200 hover:text-black transition-colors duration-150 rounded"
          >
            Về trang chủ
          </Link>
        </div>

        <div className="w-full">
          <Link
            to="/orders"
            className="btn w-full border border-gray-400 bg-white text-gray-900 hover:bg-gray-200 hover:text-black transition-colors duration-150 rounded"
          >
            Xem đơn hàng
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
