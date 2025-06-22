import React, { useContext, useEffect, useState } from "react";
import Title from "./Title";
import Item from "./Item";
import { ShopContext } from "../Context/ShopContext";

const LatestCollection = () => {
  const { product_list } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    setLatestProducts(product_list.slice(0, 10));
  }, [product_list]);

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1={"BỘ SƯU TẬP"} text2={"MỚI NHẤT"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Khám phá những sản phẩm mới nhất với thiết kế độc đáo và chất lượng
          cao.
        </p>
      </div>

      {/* Products Rendering */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {latestProducts.map((item, index) => (
          <Item key={index} data={item} />
        ))}
      </div>
    </div>
  );
};

export default LatestCollection;
