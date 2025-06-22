import React from "react";

const DescriptionBox = () => {
  return (
    <div className="mt-20 mx-auto">
      {/* Tabs */}
      <ul className="flex border-b">
        <li className="text-gray-800 font-semibold text-sm bg-gray-100 py-3 px-8 border-b-2 border-gray-800 cursor-pointer transition-all hover:bg-gray-200">
          Mô tả
        </li>
        <li className="text-gray-500 font-semibold text-sm py-3 px-8 cursor-pointer transition-all hover:bg-gray-100 hover:text-gray-800">
          Đánh giá
        </li>
      </ul>

      <div className="border px-6 py-6">
        {/* Nội dung */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-gray-800">Mô tả sản phẩm</h3>
          <p className="text-sm text-gray-600 mt-4 leading-relaxed">
            Nâng tầm phong cách thường ngày với áo thun nam cao cấp của chúng
            tôi. Được thiết kế để thoải mái và tạo kiểu với vẻ ngoài hiện đại,
            chiếc áo đa năng này là một bổ sung thiết yếu cho tủ quần áo của
            bạn. Chất liệu mềm mại và thoáng khí đảm bảo sự thoải mái cả ngày,
            hoàn hảo cho việc mặc hàng ngày. Cổ tròn cổ điển và tay ngắn mang
            đến vẻ ngoài vượt thời gian.
          </p>
        </div>

        {/* Danh sách đặc điểm */}
        <ul className="space-y-3 list-disc list-inside mt-6 text-sm text-gray-600">
          <li>
            Áo thun xám là một món đồ thiết yếu trong tủ quần áo vì nó rất đa
            năng.
          </li>
          <li>
            Có sẵn trong nhiều kích thước, từ cực nhỏ đến cực lớn, và thậm chí
            cả kích thước cao và nhỏ.
          </li>
          <li>
            Dễ dàng chăm sóc. Chúng thường có thể được giặt máy và sấy ở nhiệt
            độ thấp.
          </li>
          <li>
            Bạn có thể thêm thiết kế, họa tiết hoặc thêu riêng để làm cho nó trở
            thành của riêng bạn.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DescriptionBox;
