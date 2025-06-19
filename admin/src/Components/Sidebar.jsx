import React from 'react'
import { NavLink } from 'react-router-dom'
import { ListPlus, List, Package, Eye, User } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className='w-[18%] min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 border-r border-gray-200 shadow-lg flex flex-col'>
      {/* Header */}
      <div className='p-6 border-b border-gray-200'>
        <div className='text-center'>
          <div className='w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3'>
            <span className='text-white font-bold text-lg'>A</span>
          </div>
          <h2 className='text-lg font-bold text-gray-800'>Admin Panel</h2>
          <p className='text-sm text-gray-600'>Quản lý cửa hàng</p>
        </div>
      </div>

      {/* Navigation */}
      <div className='flex-1 p-4'>
        <div className='space-y-2'>
          <div className='mb-4'>
            <h3 className='text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2'>Tổng quan</h3>
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                }`
              }
              to="/"
            >
              <div className='flex-shrink-0'>
                <Eye size={20} />
              </div>
              <p className='hidden md:block font-medium'>Tổng Quan</p>
            </NavLink>
          </div>

          <div className='mb-4'>
            <h3 className='text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2'>Sản phẩm</h3>
            <div className='space-y-1'>
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                  }`
                }
                to="/category"
              >
                <div className='flex-shrink-0'>
                  <ListPlus size={20} />
                </div>
                <p className='hidden md:block font-medium'>Thêm Danh Mục</p>
              </NavLink>
              
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                  }`
                }
                to="/add"
              >
                <div className='flex-shrink-0'>
                  <ListPlus size={20} />
                </div>
                <p className='hidden md:block font-medium'>Thêm Sản Phẩm</p>
              </NavLink>

              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                  }`
                }
                to="/list"
              >
                <div className='flex-shrink-0'>
                  <List size={20} />
                </div>
                <p className='hidden md:block font-medium'>Danh Sách</p>
              </NavLink>
            </div>
          </div>

          <div className='mb-4'>
              <h3 className='text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2'>Người dùng</h3>
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                  }`
                }
                to="/user"
              >
                <div className='flex-shrink-0'>
                  <User size={20} />
                </div>
                <p className='hidden md:block font-medium'>Người Dùng</p>
              </NavLink>

          </div>

          <div className='mb-4'>
            <h3 className='text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2'>Đơn hàng</h3>
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                }`
              }
              to="/orders"
            >
              <div className='flex-shrink-0'>
                <Package size={20} />
              </div>
              <p className='hidden md:block font-medium'>Quản Lý Đơn Hàng</p>
            </NavLink>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className='p-4 border-t border-gray-200 bg-white'>
        <div className='flex items-center gap-3 px-4 py-2 text-gray-600'>
          <User size={16} />
          <span className='hidden md:block text-sm font-medium'>Admin User</span>
        </div>
      </div>
    </div>
  )
}

export default Sidebar