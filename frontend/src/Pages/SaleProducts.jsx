// frontend/src/Pages/SaleProducts.jsx
import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../Context/ShopContext";
import Item from "../Component/Item";
import Title from "../Component/Title";
import axios from "axios";

const SaleProducts = () => {
  const { backendUrl } = useContext(ShopContext);
  const [saleProducts, setSaleProducts] = useState([]);

  useEffect(() => {
    const fetchSaleProducts = async () => {
      const response = await axios.get(backendUrl + "/api/product/sale");
      if (response.data.success) {
        setSaleProducts(response.data.products);
      }
    };
    fetchSaleProducts();
  }, [backendUrl]);
  console.log(saleProducts);
  return (
    <div>
      <div className="text-center py-8 text-3xl">
        <Title text1={"SẢN PHẨM"} text2={"ĐANG SALE"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Khám phá những sản phẩm đang có ưu đãi đặc biệt
        </p>
      </div>

      {/* Loading state */}
      {!saleProducts ? (
        <div className="text-center py-8">
          <p>Đang tải sản phẩm...</p>
        </div>
      ) : saleProducts.length === 0 ? (
        <div className="text-center py-8">
          <p>Hiện tại không có sản phẩm nào đang sale</p>
        </div>
      ) : (
        /* Render Products */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
          {saleProducts.map((item, index) => (
            <Item key={index} data={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SaleProducts;
