import React from 'react'

const SaleTag = ({ oldPrice, newPrice, isSale }) => {
  // Chỉ hiển thị nếu sản phẩm được đánh dấu sale VÀ có giá cũ > giá mới
  if (!isSale || !oldPrice || !newPrice || oldPrice <= newPrice) {
    return null;
  }

  const discountPercentage = Math.round(((oldPrice - newPrice) / oldPrice) * 100);

  return (
    <div className="absolute top-2 left-2 z-10">
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
        🔥 -{discountPercentage}%
      </div>
    </div>
  );
};

export default SaleTag