import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";
import SaleTag from "./SaleTag";

const Item = ({ data }) => {
  const { formatCurrency } = useContext(ShopContext);

  return (
    <Link
      to={`/product/${data?._id}`}
      className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-all duration-300 block"
    >
      <div className="relative">
        <SaleTag
          oldPrice={data?.old_price}
          newPrice={data?.new_price}
          isSale={data?.sale}
        />
        <img
          src={data?.image[0]}
          alt={data?.name}
          className="w-full aspect-[3/4] object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-sm font-medium text-gray-900 truncate">
          {data?.name}
        </h3>

        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
            {data?.category?.name}
          </span>
          <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
            {data?.subCategory?.name}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <p className="text-base font-semibold text-black">
            {formatCurrency(data?.new_price)}
          </p>
          {data?.old_price && data?.old_price > data?.new_price && (
            <p className="text-sm line-through text-gray-400">
              {formatCurrency(data?.old_price)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default Item;
