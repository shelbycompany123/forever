import React, { useEffect, useState } from 'react'
import axios from "axios"
import {backendUrl} from '../App.jsx'
import toast from 'react-hot-toast'
import { assets } from '../assets/assets'

const Orders = ({token}) => {

  const [orders, setOrders] = useState([])

  const fetchAllOrders = async () => {
    if (!token) {
      return null
    }

    try {

      const response = await axios.post(backendUrl + '/api/order/list', {}, {headers: {token}})
      if (response.data.success) {
        setOrders(response.data.orders)
      } else {
        toast.error(response.data.message)
      }
      
    } catch (error) {
        toast.error(error.message)
    }

  } 

  const formatCurrency = (amount) => {
      const formatted = amount.toLocaleString('vi-VN');
      return formatted.replace(/\./g, ',') + ' VNĐ';
    };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(backendUrl + '/api/order/status', {orderId, status: event.target.value}, {headers: {token}})
      if (response.data.success) {
        await fetchAllOrders()
      }
    } catch (error) {
      console.log(error);
      toast.error(response.data.message)
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, [token])

  return (
    <div className='max-w-6xl mx-auto m-6'>
      {/* Header Section */}
      <div className='bg-white rounded-lg p-6 shadow-lg mb-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>Orders</h1>
            <p className='text-gray-600 mt-1'>Theo dõi và cập nhật trạng thái đơn hàng</p>
          </div>
          <div className='bg-green-50 px-4 py-2 rounded-lg'>
            <span className='text-green-700 font-semibold'>Tổng: {orders.length} đơn hàng</span>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
            {/* Order Header */}
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <img src={assets.parcel_icon} alt="" className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Đơn hàng #{index + 1}</h3>
                    <p className="text-sm text-gray-600">{new Date(order.date).toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">{formatCurrency(order.amount)}</p>
                  <p className="text-sm text-gray-600">{order.items.length} sản phẩm</p>
                </div>
              </div>
            </div>

            {/* Order Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Customer & Items Info */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Thông Tin Khách Hàng</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-medium text-gray-900">
                        {order.address.firstName} {order.address.lastName}
                      </p>
                      <div className="text-sm text-gray-600 mt-2 space-y-1">
                        <p>{order.address.street}</p>
                        <p>{order.address.city}, {order.address.state}</p>
                        <p>{order.address.country}, {order.address.zipcode}</p>
                        <p className="font-medium">📞 {order.address.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Sản Phẩm Đặt Hàng</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-sm">
                            <span className="text-gray-700">
                              {item.name}
                              <span className="text-gray-500"> (Size: {item.size})</span>
                            </span>
                            <span className="font-medium">x{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Details & Status */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Chi Tiết Đơn Hàng</h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phương thức thanh toán:</span>
                        <span className="font-medium">{order.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Trạng thái thanh toán:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.payment
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.payment ? 'Đã thanh toán' : 'Chờ thanh toán'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ngày đặt hàng:</span>
                        <span className="font-medium">{new Date(order.date).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Cập Nhật Trạng Thái</h4>
                    <select
                      onChange={(event) => statusHandler(event, order._id)}
                      value={order.status}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:outline-none transition-colors bg-white"
                    >
                      <option value="Order Placed">Đã đặt hàng</option>
                      <option value="Packing">Đang đóng gói</option>
                      <option value="Shipped">Đã gửi hàng</option>
                      <option value="Out for delivery">Đang giao hàng</option>
                      <option value="Delivered">Đã giao hàng</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

  )
}

export default Orders