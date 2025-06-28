import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../Context/ShopContext";
import Title from "../Component/Title";
import Item from "./Item";
import axios from "axios";

const RelatedProduct = ({ productId }) => {
  const { backendUrl } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      const response = await axios.get(
        backendUrl + `/api/product/related?productId=${productId}`
      );
      setRelated(response.data.products);
    };
    fetchRelatedProducts();
  }, [productId]);

  return (
    <div className="my-24">
      <div className="text-center text-3xl py-2">
        <Title text1={"SẢN PHẨM"} text2={"LIÊN QUAN"} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {related.map((item, index) => {
          return <Item key={index} data={item} />;
        })}
      </div>
    </div>
  );
};

export default RelatedProduct;
