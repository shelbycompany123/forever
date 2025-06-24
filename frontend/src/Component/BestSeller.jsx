import React, { useContext } from "react";
import Title from "./Title";
import Item from "./Item";
import { ShopContext } from "../Context/ShopContext";

const BestSeller = () => {
  const { product_list } = useContext(ShopContext);
  const bestSeller = product_list.filter((product) => product.bestseller);

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1={"SẢN PHẨM"} text2={"BÁN CHẠY"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Những sản phẩm được yêu thích nhất với chất lượng và thiết kế vượt
          trội.
        </p>
      </div>

      {/* Products Rendering */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {bestSeller.map((item, index) => (
          <Item key={index} data={item} />
        ))}
      </div>
    </div>
  );
};

export default BestSeller;
