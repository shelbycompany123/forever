import React from "react";
import { NavLink } from "react-router-dom";
import { ListPlus, List, Package, Eye, User } from "lucide-react";

const Sidebar = () => {
  return (
    <div className="w-[18%] min-h-screen bg-white border-r border-gray-200 shadow-lg flex flex-col fixed top-0  overflow-y-auto pt-24">
      {/* Header */}

      {/* Navigation */}
      <div className="flex-1 p-4">
        <div className="space-y-2">
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
              Tổng quan
            </h3>
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-black text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100 hover:text-black"
                }`
              }
              to="/"
            >
              <div className="flex-shrink-0">
                <Eye size={20} />
              </div>
              <p className="hidden md:block font-medium">Tổng Quan</p>
            </NavLink>
          </div>

          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
              Sản phẩm
            </h3>
            <div className="space-y-1">
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "bg-black text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100 hover:text-black"
                  }`
                }
                to="/category"
              >
                <div className="flex-shrink-0">
                  <ListPlus size={20} />
                </div>
                <p className="hidden md:block font-medium">Thêm Danh Mục</p>
              </NavLink>

              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "bg-black text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100 hover:text-black"
                  }`
                }
                to="/add"
              >
                <div className="flex-shrink-0">
                  <ListPlus size={20} />
                </div>
                <p className="hidden md:block font-medium">Thêm Sản Phẩm</p>
              </NavLink>

              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "bg-black text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100 hover:text-black"
                  }`
                }
                to="/list"
              >
                <div className="flex-shrink-0">
                  <List size={20} />
                </div>
                <p className="hidden md:block font-medium">Danh Sách</p>
              </NavLink>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
              Người dùng
            </h3>
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-black text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100 hover:text-black"
                }`
              }
              to="/user"
            >
              <div className="flex-shrink-0">
                <User size={20} />
              </div>
              <p className="hidden md:block font-medium">Người Dùng</p>
            </NavLink>
          </div>

          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
              Đơn hàng
            </h3>
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-black text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100 hover:text-black"
                }`
              }
              to="/orders"
            >
              <div className="flex-shrink-0">
                <Package size={20} />
              </div>
              <p className="hidden md:block font-medium">Quản Lý Đơn Hàng</p>
            </NavLink>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 sticky bottom-0">
        <div className="flex items-center gap-3 px-4 py-2 text-gray-600">
          <User size={16} />
          <span className="hidden md:block text-sm font-medium">
            Admin User
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
