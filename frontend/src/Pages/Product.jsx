import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";
import { assets } from "../assets/assets";
import DescriptionBox from "../Component/DescriptionBox";
import RelatedProduct from "../Component/RelatedProduct";
import ProductRating from "../Component/ProductRating";
import axios from "axios";

const Product = () => {
  const { productId } = useParams();
  const { product_list, addToCart, backendUrl, getDisplayPrice } =
    useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [loading, setLoading] = useState(true);
  const [ratingData, setRatingData] = useState({
    averageRating: 0,
    totalRatings: 0,
  });
  const [countdown, setCountdown] = useState(null);

  const formatCurrency = (amount) => {
    const formatted = amount?.toLocaleString("vi-VN");
    return formatted?.replace(/\./g, ",") + " VNĐ";
  };

  // Render stars
  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <img
            key={star}
            src={assets.star_icon}
            alt=""
            className={`w-3 ${rating >= star ? "opacity-100" : "opacity-30"}`}
          />
        ))}
      </div>
    );
  };

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(
          backendUrl + `/api/product/get/${productId}`
        );
        setProductData(response.data.data);
        setImage(response.data.data.image[0]);

        // Lấy thông tin đánh giá
        try {
          const ratingResponse = await axios.get(
            backendUrl + `/api/rating/get/${productId}`
          );
          if (ratingResponse.data.success) {
            setRatingData({
              averageRating: ratingResponse.data.averageRating,
              totalRatings: ratingResponse.data.totalRatings,
            });
          }
        } catch (error) {
          console.log("Error fetching rating:", error);
        }

        setLoading(false);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [productId, product_list]);

  useEffect(() => {
    if (!productData || !productData.promo_end || !productData.promo_start) {
      setCountdown(null);
      return;
    }
    const now = Date.now();
    const promoStart = new Date(productData.promo_start).getTime();
    const promoEnd = new Date(productData.promo_end).getTime();
    if (now < promoStart || now > promoEnd) {
      setCountdown(null);
      return;
    }
    const updateCountdown = () => {
      const now = Date.now();
      const distance = promoEnd - now;
      if (distance <= 0) {
        setCountdown(null);
        return;
      }
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((distance / (1000 * 60)) % 60);
      const seconds = Math.floor((distance / 1000) % 60);
      setCountdown({ days, hours, minutes, seconds });
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [productData]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        <p className="text-2xl font-bold">Đang tải...</p>
      </div>
    );

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* Product Data */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* Product Images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData?.image?.map((item, index) => {
              return (
                <img
                  onClick={() => setImage(item)}
                  src={item}
                  key={index}
                  className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                  alt=""
                />
              );
            })}
          </div>
          <div className="w-full sm:w-[80%]">
            <img className="w-full h-auto" src={image} alt="" />
          </div>
        </div>

        {/* Product Infor */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            {renderStars(ratingData.averageRating)}
            <p className="pl-2">({ratingData.totalRatings})</p>
          </div>
          <div className="flex gap-5">
            <p className="mt-5 text-3xl font-medium">
              {formatCurrency(getDisplayPrice(productData))}
            </p>
            {productData.promo_price &&
              productData.promo_start &&
              productData.promo_end &&
              new Date(productData.promo_start) <= Date.now() &&
              Date.now() <= new Date(productData.promo_end) && (
                <p className="mt-5 text-3xl font-sm text-gray-400 line-through italic">
                  {formatCurrency(productData.selling_price)}
                </p>
              )}
          </div>
          {countdown && (
            <div className="mt-2 mb-2 text-orange-600 font-semibold text-lg">
              Kết thúc khuyến mãi sau:{" "}
              {countdown.days > 0 ? `${countdown.days} ngày ` : ""}
              {countdown.hours.toString().padStart(2, "0")}:
              {countdown.minutes.toString().padStart(2, "0")}:
              {countdown.seconds.toString().padStart(2, "0")}
            </div>
          )}
          <p className="mt-5 text-gray-500 md:w-4/5 whitespace-pre-line">
            {productData.description}
          </p>
          <div className="flex flex-col gap-4 my-8">
            <p>Chọn kích thước</p>
            <div className="flex gap-2">
              {Object?.entries(productData?.sizes)?.map(
                ([key, quantity], index) => (
                  <button
                    onClick={() => quantity > 0 && setSize(key)}
                    disabled={quantity === 0}
                    className={`border py-2 px-4 ${
                      key === size
                        ? "border-orange-500 bg-orange-50"
                        : "bg-gray-100"
                    } ${
                      quantity === 0
                        ? "opacity-50 cursor-not-allowed text-gray-400"
                        : "hover:border-orange-300 cursor-pointer"
                    }`}
                    key={index}
                  >
                    <div className="text-center">
                      <div className="font-medium">{key}</div>
                      <div className="text-xs text-gray-600">
                        {quantity > 0 ? `Còn ${quantity}` : "Hết hàng"}
                      </div>
                    </div>
                  </button>
                )
              )}
            </div>
            {size && (
              <div className="text-sm text-gray-600">
                Đã chọn: <span className="font-medium">{size}</span>
                {productData.sizes[size] > 0 && (
                  <span className="ml-2">
                    ({productData.sizes[size]} có sẵn)
                  </span>
                )}
              </div>
            )}
          </div>
          <button
            onClick={() => addToCart(productData._id, size)}
            disabled={!size || productData.sizes[size] === 0}
            className={`px-8 py-3 text-sm ${
              size && productData.sizes[size] > 0
                ? "bg-black text-white active:bg-gray-700 cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {!size
              ? "CHỌN KÍCH THƯỚC"
              : productData.sizes[size] === 0
              ? "HẾT HÀNG"
              : "THÊM VÀO GIỎ"}
          </button>
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>✦ 100% Sản phẩm chính hãng.</p>
            <p>✦ Thanh toán khi nhận hàng có sẵn cho sản phẩm này.</p>
            <p>✦ Chính sách đổi trả dễ dàng trong vòng 7 ngày.</p>
          </div>
        </div>
      </div>

      {/* Description & Review */}
      <DescriptionBox />

      {/* Product Ratings */}
      <ProductRating productId={productData._id} />

      {/* Related Product */}
      <RelatedProduct productId={productId} />
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
