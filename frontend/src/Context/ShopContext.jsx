import React, { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const delivery_fee = 20000;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [product_list, setProduct_list] = useState([]);
  const [orderData, setOrderData] = useState([]);

  const pathname = useLocation();

  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const formatCurrency = (amount) => {
    const formatted = amount?.toLocaleString("vi-VN");
    return formatted?.replace(/\./g, ",") + " VNĐ";
  };

  const getDisplayPrice = (data) => {
    const now = Date.now();
    if (
      data.promo_price &&
      data.promo_start &&
      data.promo_end &&
      new Date(data.promo_start) <= now &&
      now <= new Date(data.promo_end)
    ) {
      return data.promo_price;
    }
    return data.selling_price;
  };

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Vui Lòng Chọn Size !");
      return;
    }

    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
    setCartItems(cartData);

    if (token) {
      try {
        const userId = localStorage.getItem("userId");
        const data = await axios.post(
          backendUrl + "/api/cart/add",
          { itemId, size, quantity: cartData[itemId][size], userId: userId },
          { headers: { token } }
        );
        if (data.data.success) {
          toast.success(data.data.message);
        } else {
          getUserCart(token);

          toast.error(data.data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const getCartCount = () => {
    let total = 0;

    Object.values(cartItems).forEach((sizes) => {
      Object.values(sizes).forEach((quantity) => {
        total += quantity;
      });
    });

    return total;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);

    cartData[itemId][size] = quantity;

    setCartItems(cartData);

    if (token) {
      try {
        const data = await axios.post(
          backendUrl + "/api/cart/update",
          { itemId, size, quantity, userId: localStorage.getItem("userId") },
          { headers: { token } }
        );
        if (!data.data.success) {
          getUserCart(token);
          toast.error(data.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const getUserCart = async (token) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = product_list.find((product) => product._id === items);
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalAmount += itemInfo.new_price * cartItems[items][item];
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    return totalAmount;
  };

  useEffect(() => {
    const getProductsData = async () => {
      try {
        const response = await axios.get(backendUrl + "/api/product/list");
        if (response.data.success) {
          setProduct_list(response.data.products);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    };
    getProductsData();
  }, [backendUrl]);

  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
      getUserCart(localStorage.getItem("token"));
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const contextValue = {
    delivery_fee,
    product_list,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    setCartItems,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    formatCurrency,
    getDisplayPrice,
    setToken,
    token,
    orderData,
    setOrderData,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
