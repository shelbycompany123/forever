import React from "react";

const SaleTag = ({ sellingPrice, promoPrice, isPromoActive }) => {
  if (
    !isPromoActive ||
    !sellingPrice ||
    !promoPrice ||
    sellingPrice <= promoPrice
  ) {
    return null;
  }

  const discountPercentage = Math.round(
    ((sellingPrice - promoPrice) / sellingPrice) * 100
  );

  return (
    <div className="absolute top-3 left-3 z-20">
      <div className="bg-red-600 text-white px-3 py-1 rounded-md text-xs font-bold shadow-md">
        -{discountPercentage}%
      </div>
    </div>
  );
};

export default SaleTag;
