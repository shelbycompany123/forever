import React from "react";
import { assets } from "../assets/assets";
import { LogOut, Bell, Settings } from "lucide-react";

const Navbar = ({ setToken }) => {
  return (
    <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="flex items-center py-4 px-6 justify-between max-w-full">
        {/* Logo Section */}
        <div className="flex items-center">
          <img
            className="w-[max(10%,80px)] h-auto"
            src={assets.logo}
            alt="Logo"
          />
          <div className="ml-4 hidden sm:block">
            <h1 className="text-xl font-bold text-black">Forever Admin</h1>
            <p className="text-sm text-gray-600">Quản lý cửa hàng</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
            </button>
          </div>

          {/* Settings */}
          <div className="hidden sm:block">
            <button className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors">
              <Settings size={20} />
            </button>
          </div>

          {/* Admin Profile */}
          <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">A</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-black">Admin</p>
              <p className="text-xs text-gray-600">Quản trị viên</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => setToken("")}
            className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-4 py-2 sm:px-6 sm:py-2 rounded-lg text-sm font-medium transition-colors shadow-md hover:shadow-lg"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Đăng Xuất</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
