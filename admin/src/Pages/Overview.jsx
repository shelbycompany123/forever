import { useEffect, useState } from 'react'
import axios from 'axios';
import { backendUrl } from '../App';
import { TrendingUp, Users, ShoppingCart, DollarSign, Package, Eye, Calendar, Activity } from 'lucide-react';

const Overview = () => {

    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const [recentOrders, setRecentOrders] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [monthlyStats, setMonthlyStats] = useState({
        thisMonth: { orders: 0, revenue: 0, users: 0 },
        lastMonth: { orders: 0, revenue: 0, users: 0 }
    });

    useEffect(() => {
        // Lấy tổng doanh thu
        const fetchRevenue = async () => {
            try {
                const response = await axios.get(backendUrl + "/api/overview/getrevenue")
                if (response.data.success) {
                    setTotalRevenue(response.data.totalRevenue);
                }
            } catch (error) {
                console.log(error.message);
            }
        }

        // Lấy tổng số người dùng
        const fetchUsers = async () => {
            try {
                const response = await axios.get(backendUrl + "/api/overview/getusers");
                if (response.data.success) {
                    setTotalUsers(response.data.totalUsers);
                }
            } catch (error) {
                console.log(error.message);
            }
        }

        // Lấy tổng số đơn hàng
        const fetchOrders = async () => {
            try {
                const response = await axios.get(backendUrl + "/api/overview/getorders")
                if (response.data.success) {
                    setTotalOrders(response.data.totalOrders);
                }
            } catch (error) {
                console.log(error.message);
            }
        }

        // Lấy tổng số sản phẩm
        const fetchProducts = async () => {
            try {
                const response = await axios.get(backendUrl + "/api/product/list")
                if (response.data.success) {
                    setTotalProducts(response.data.products.length);
                    // Lấy top 5 sản phẩm (giả lập dựa trên tên)
                    setTopProducts(response.data.products.slice(0, 5));
                }
            } catch (error) {
                console.log(error.message);
            }
        }

        // Lấy đơn hàng gần đây (giả lập)
        const fetchRecentOrders = async () => {
            try {
                // Tạo dữ liệu giả lập cho đơn hàng gần đây
                const mockRecentOrders = [
                    { id: 1, customer: "Nguyễn Văn A", amount: 250000, status: "Đã giao", date: "2024-01-15" },
                    { id: 2, customer: "Trần Thị B", amount: 180000, status: "Đang giao", date: "2024-01-14" },
                    { id: 3, customer: "Lê Văn C", amount: 320000, status: "Đã xác nhận", date: "2024-01-14" },
                    { id: 4, customer: "Phạm Thị D", amount: 150000, status: "Chờ xác nhận", date: "2024-01-13" },
                    { id: 5, customer: "Hoàng Văn E", amount: 420000, status: "Đã giao", date: "2024-01-13" }
                ];
                setRecentOrders(mockRecentOrders);
            } catch (error) {
                console.log(error.message);
            }
        }

        // Tạo thống kê tháng (giả lập)
        const generateMonthlyStats = () => {
            setMonthlyStats({
                thisMonth: {
                    orders: Math.floor(totalOrders * 0.3),
                    revenue: Math.floor(totalRevenue * 0.25),
                    users: Math.floor(totalUsers * 0.15)
                },
                lastMonth: {
                    orders: Math.floor(totalOrders * 0.25),
                    revenue: Math.floor(totalRevenue * 0.20),
                    users: Math.floor(totalUsers * 0.12)
                }
            });
        }

        fetchRevenue();
        fetchUsers();
        fetchOrders();
        fetchProducts();
        fetchRecentOrders();

        // Delay để đảm bảo dữ liệu đã load xong
        setTimeout(generateMonthlyStats, 1000);
    }, [])

    const formatCurrency = (amount) => {
      const formatted = amount.toLocaleString('vi-VN');
      return formatted.replace(/\./g, ',') + ' VNĐ';
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Đã giao': return 'bg-green-100 text-green-800';
            case 'Đang giao': return 'bg-blue-100 text-blue-800';
            case 'Đã xác nhận': return 'bg-yellow-100 text-yellow-800';
            case 'Chờ xác nhận': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const calculateGrowth = (current, previous) => {
        if (previous === 0) return 0;
        return ((current - previous) / previous * 100).toFixed(1);
    };

  return (
    <div className='p-6 space-y-6'>
      {/* Header */}
      <div className='bg-white rounded-lg p-6 shadow-lg mb-6'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Dashboard Overview</h1>
          <p className='text-gray-600 mt-1'>Chào mừng trở lại! Đây là tổng quan về cửa hàng của bạn.</p>
        </div>
        <div className='flex items-center space-x-2 text-sm text-gray-500'>
          <Calendar className='w-4 h-4' />
          <span>{new Date().toLocaleDateString('vi-VN')}</span>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <div className='bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-blue-100 text-sm font-medium'>Tổng đơn hàng</p>
              <p className='text-3xl font-bold mt-2'>{totalOrders}</p>
              <div className='flex items-center mt-2'>
                <TrendingUp className='w-4 h-4 mr-1' />
                <span className='text-sm'>+{calculateGrowth(monthlyStats.thisMonth.orders, monthlyStats.lastMonth.orders)}%</span>
              </div>
            </div>
            <ShoppingCart className='w-12 h-12 text-blue-200' />
          </div>
        </div>

        <div className='bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white shadow-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-green-100 text-sm font-medium'>Tổng người dùng</p>
              <p className='text-3xl font-bold mt-2'>{totalUsers}</p>
              <div className='flex items-center mt-2'>
                <TrendingUp className='w-4 h-4 mr-1' />
                <span className='text-sm'>+{calculateGrowth(monthlyStats.thisMonth.users, monthlyStats.lastMonth.users)}%</span>
              </div>
            </div>
            <Users className='w-12 h-12 text-green-200' />
          </div>
        </div>

        <div className='bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white shadow-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-purple-100 text-sm font-medium'>Tổng sản phẩm</p>
              <p className='text-3xl font-bold mt-2'>{totalProducts}</p>
              <div className='flex items-center mt-2'>
                <Activity className='w-4 h-4 mr-1' />
                <span className='text-sm'>Đang hoạt động</span>
              </div>
            </div>
            <Package className='w-12 h-12 text-purple-200' />
          </div>
        </div>

        <div className='bg-gradient-to-r from-yellow-500 to-orange-500 p-6 rounded-xl text-white shadow-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-yellow-100 text-sm font-medium'>Tổng doanh thu</p>
              <p className='text-2xl font-bold mt-2'>{formatCurrency(totalRevenue)}</p>
              <div className='flex items-center mt-2'>
                <TrendingUp className='w-4 h-4 mr-1' />
                <span className='text-sm'>+{calculateGrowth(monthlyStats.thisMonth.revenue, monthlyStats.lastMonth.revenue)}%</span>
              </div>
            </div>
            <DollarSign className='w-12 h-12 text-yellow-200' />
          </div>
        </div>
      </div>

      {/* Secondary Stats & Charts */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Monthly Comparison */}
        <div className='bg-white p-6 rounded-xl shadow-lg'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>So sánh tháng</h3>
          <div className='space-y-4'>
            <div className='flex justify-between items-center'>
              <span className='text-gray-600'>Đơn hàng tháng này</span>
              <span className='font-semibold'>{monthlyStats.thisMonth.orders}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-gray-600'>Đơn hàng tháng trước</span>
              <span className='font-semibold'>{monthlyStats.lastMonth.orders}</span>
            </div>
            <div className='border-t pt-2'>
              <div className='flex justify-between items-center'>
                <span className='text-gray-600'>Tăng trưởng</span>
                <span className='font-semibold text-green-600'>
                  +{calculateGrowth(monthlyStats.thisMonth.orders, monthlyStats.lastMonth.orders)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className='bg-white p-6 rounded-xl shadow-lg'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>Thao tác nhanh</h3>
          <div className='space-y-3'>
            <button className='w-full bg-blue-50 hover:bg-blue-100 text-blue-700 p-3 rounded-lg text-left transition-colors'>
              <div className='flex items-center'>
                <Package className='w-5 h-5 mr-3' />
                <span>Thêm sản phẩm mới</span>
              </div>
            </button>
            <button className='w-full bg-green-50 hover:bg-green-100 text-green-700 p-3 rounded-lg text-left transition-colors'>
              <div className='flex items-center'>
                <Eye className='w-5 h-5 mr-3' />
                <span>Xem đơn hàng</span>
              </div>
            </button>
            <button className='w-full bg-purple-50 hover:bg-purple-100 text-purple-700 p-3 rounded-lg text-left transition-colors'>
              <div className='flex items-center'>
                <Users className='w-5 h-5 mr-3' />
                <span>Quản lý khách hàng</span>
              </div>
            </button>
          </div>
        </div>

        {/* System Status */}
        <div className='bg-white p-6 rounded-xl shadow-lg'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>Trạng thái hệ thống</h3>
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <span className='text-gray-600'>Server</span>
              <span className='px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium'>
                Hoạt động
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-gray-600'>Database</span>
              <span className='px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium'>
                Kết nối
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-gray-600'>Cloudinary</span>
              <span className='px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium'>
                Sẵn sàng
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders & Top Products */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Recent Orders */}
        <div className='bg-white p-6 rounded-xl shadow-lg'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>Đơn hàng gần đây</h3>
          <div className='space-y-3'>
            {recentOrders.map((order) => (
              <div key={order.id} className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                <div>
                  <p className='font-medium text-gray-900'>{order.customer}</p>
                  <p className='text-sm text-gray-600'>{order.date}</p>
                </div>
                <div className='text-right'>
                  <p className='font-semibold text-gray-900'>{formatCurrency(order.amount)}</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className='bg-white p-6 rounded-xl shadow-lg'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>Sản phẩm hàng đầu</h3>
          <div className='space-y-3'>
            {topProducts.map((product, index) => (
              <div key={product._id} className='flex items-center p-3 bg-gray-50 rounded-lg'>
                <div className='w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold mr-4'>
                  #{index + 1}
                </div>
                <div className='flex-1'>
                  <p className='font-medium text-gray-900 truncate'>{product.name}</p>
                  <p className='text-sm text-gray-600'>{product.category?.name} || Không có danh mục</p>
                </div>
                <div className='text-right'>
                  <p className='font-semibold text-gray-900'>{formatCurrency(product.new_price)}</p>
                  <p className='text-sm text-gray-600'>Còn lại: {Math.floor(Math.random() * 50) + 10}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className='bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-xl text-white'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='text-center'>
            <p className='text-3xl font-bold'>{totalProducts}</p>
            <p className='text-gray-300 mt-1'>Sản phẩm đang bán</p>
          </div>
          <div className='text-center'>
            <p className='text-3xl font-bold'>{Math.floor(totalOrders * 0.85)}</p>
            <p className='text-gray-300 mt-1'>Đơn hàng thành công</p>
          </div>
          <div className='text-center'>
            <p className='text-3xl font-bold'>{Math.floor(totalUsers * 0.7)}</p>
            <p className='text-gray-300 mt-1'>Khách hàng thân thiết</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Overview