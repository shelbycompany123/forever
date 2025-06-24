import React, { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import Title from "../Component/Title";

const CartTotal = ({ selectedItems = [] }) => {
  const { product_list, formatCurrency, getDisplayPrice } =
    useContext(ShopContext);

  const getSelectedItemsAmount = () => {
    let totalAmount = 0;
    selectedItems.forEach((item) => {
      const productData = product_list.find(
        (product) => product._id === item._id
      );
      if (productData) {
        totalAmount += getDisplayPrice(productData) * item.quantity;
      }
    });
    return totalAmount;
  };

  const subtotal = getSelectedItemsAmount();
  const total = subtotal === 0 ? 0 : subtotal;

  return (
    <div className="w-full">
      <div className="text-2xl">
        <Title text1={"TỔNG"} text2={"GIỎ HÀNG"} />
      </div>

      <div className="flex flex-col gap-2 mt-2 text-sm">
        <div className="flex justify-between">
          <p>Tạm tính ({selectedItems.length} sản phẩm)</p>
          <p>{formatCurrency(subtotal)}</p>
        </div>
        <hr />

        <hr />
        <div className="flex justify-between">
          <b>Tổng cộng</b>
          <b>{formatCurrency(total)}</b>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
