import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { Search, CircleUserRound, ShoppingCart } from "lucide-react";
import { ShopContext } from "../Context/ShopContext";

const Navbar = () => {
  const [visible, setVisible] = useState(false);

  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
  } = useContext(ShopContext);

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setToken("");
    setCartItems({});
  };

  return (
    <div className="navbar flex items-center justify-between py-5 font-medium sticky top-0 z-50 bg-white">
      <div className="navbar-start">
        <Link to="/">
          <img className="w-36" src={assets.logo} alt="" />
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex gap-8 px-1">
        <NavLink
          to="/"
          className="relative pb-2 after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-[2px] after:bg-black after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
        >
          TRANG CHỦ
        </NavLink>
        <NavLink
          to="/collection"
          className="relative pb-2 after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-[2px] after:bg-black after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
        >
          BỘ SƯU TẬP
        </NavLink>
        <NavLink
          to="/about"
          className="relative pb-2 after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-[2px] after:bg-black after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
        >
          GIỚI THIỆU
        </NavLink>
        <NavLink
          to="/contact"
          className="relative pb-2 after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-[2px] after:bg-black after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
        >
          LIÊN HỆ
        </NavLink>
        <NavLink
          to="/sale"
          className="relative pb-2 after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-[2px] after:bg-red-500 after:transition-all after:duration-300 hover:after:w-full hover:after:left-0 text-red-600 font-bold"
        >
          KHUYẾN MÃI
        </NavLink>
      </div>
      <div className="navbar-end">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              navigate("/collection");
              setShowSearch(true);
            }}
            className="btn btn-ghost btn-circle cursor-pointer"
          >
            <Search className="w-5" />
          </button>
          <Link to="/cart" className="relative">
            <button className="btn btn-ghost btn-circle cursor-pointer">
              <ShoppingCart className="w-5" />
            </button>
            <span className="absolute right-[-2px] bottom-[-2px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
              {getCartCount()}
            </span>
          </Link>
          <div className="dropdown dropdown-end">
            <div>
              <button
                tabIndex={0}
                className="btn btn-ghost btn-circle cursor-pointer"
              >
                <CircleUserRound className="w-5" />
              </button>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded gap-2 w-36 py-2 px-3 text-gray-500 shadow"
            >
              {token && (
                <NavLink to="/profile">
                  <li className="cursor-pointer hover:text-black">
                    Hồ sơ của tôi
                  </li>
                </NavLink>
              )}
              {token && (
                <li
                  onClick={() => navigate("/orders")}
                  className="cursor-pointer hover:text-black"
                >
                  Đơn hàng
                </li>
              )}
              {token && (
                <li
                  onClick={logout}
                  className="cursor-pointer hover:text-black"
                >
                  Đăng xuất
                </li>
              )}
              {!token && (
                <NavLink to="/login">
                  <li className="cursor-pointer hover:text-black">Đăng nhập</li>
                </NavLink>
              )}
            </ul>
          </div>
        </div>
        <img
          onClick={() => setVisible(true)}
          className="w-5 cursor-pointer sm:hidden"
          src={assets.menu_icon}
          alt=""
        />
      </div>

      {/* Sidebar Menu For Small screens */}
      <div
        className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${
          visible ? "w-full" : "w-0"
        }`}
      >
        <div className="flex flex-col text-gray-600">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3 cursor-pointer"
          >
            <img className="h-4 rotate-180" src={assets.dropdown_icon} alt="" />
            <p>Quay lại</p>
          </div>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/"
          >
            TRANG CHỦ
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/collection"
          >
            BỘ SƯU TẬP
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/about"
          >
            GIỚI THIỆU
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/contact"
          >
            LIÊN HỆ
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/sale"
          >
            KHUYẾN MÃI
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
