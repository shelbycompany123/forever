import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl } from '../App'
import toast from 'react-hot-toast'
import { Trash2, SquarePen  } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ListProducts = ({token}) => {

  const [list, setList] = useState([])
  const navigate = useNavigate()

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list")
      if (response.data.success) {
        setList(response.data.products);
      }
      else {
        toast.error(response.data.message)
      }
      
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(backendUrl + '/api/product/remove', {id}, {headers: {token}})

      if (response.data.success) {
        toast.success("Removed Successfullys")
        await fetchList();
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  const formatCurrency = (amount) => {
    const formatted = amount.toLocaleString('vi-VN');
    return formatted.replace(/\./g, ',') + ' VNĐ';
  };

  console.log(list);
  

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <div className='max-w-7xl mx-auto m-6'>
      {/* Header Section */}
      <div className='bg-white rounded-lg p-6 shadow-lg mb-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>List Items</h1>
            <p className='text-gray-600 mt-1'>Quản lý tất cả sản phẩm trong cửa hàng</p>
          </div>
          <div className='bg-blue-50 px-4 py-2 rounded-lg'>
            <span className='text-blue-700 font-semibold'>Tổng: {list.length} sản phẩm</span>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
        <div className="overflow-x-auto">
          <table className="table w-full">
            {/* head */}
            <thead className='bg-gray-50'>
              <tr>
                <th className='text-gray-700 font-semibold'>#</th>
                <th className='text-gray-700 font-semibold'>Hình Ảnh</th>
                <th className='text-gray-700 font-semibold'>Tên Sản Phẩm</th>
                <th className='text-gray-700 font-semibold'>Danh Mục</th>
                <th className='text-gray-700 font-semibold'>Kích Thước</th>
                <th className='text-gray-700 font-semibold'>Giá Mới</th>
                <th className='text-gray-700 font-semibold'>Giá Cũ</th>
                <th className='text-gray-700 font-semibold'>Sale</th>
                <th className='text-gray-700 font-semibold'>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item, index) => {
                return (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <th className='text-gray-600 font-medium'>{index + 1}</th>
                    <td>
                      <div className='w-16 h-16 rounded-lg overflow-hidden border border-gray-200'>
                        <img className='w-full h-full object-cover' src={item.image[0]} alt="" />
                      </div>
                    </td>
                    <td>
                      <div className='font-medium text-gray-900'>{item.name}</div>
                    </td>
                    <td>
                      <span className='px-3 py-1 whitespace-nowrap bg-blue-100 text-blue-800 rounded-full text-sm font-medium'>
                        {item?.category?.name} - {item?.subCategory?.name}
                      </span>
                    </td>
                    <td>
                      <div className='flex flex-wrap gap-1'>
                        {item.sizes.map((size, idx) => (
                          <span key={idx} className='px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium'>
                            {size}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span className='font-semibold text-green-600'>{formatCurrency(item.new_price)}</span>
                    </td>
                    <td>
                      <span className='text-gray-500 line-through'>{formatCurrency(item.old_price)}</span>
                    </td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.sale 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {item.sale ? '🏷️ Sale' : 'Thường'}
                      </span>
                    </td>
                    <td>
                      <div className='flex gap-2'>
                        <button
                          onClick={() => removeProduct(item._id)}
                          className='btn btn-circle btn-ghost hover:bg-red-50 hover:text-red-600 transition-colors'
                        >
                          <Trash2 size={18} />
                        </button>
                        <button
                          onClick={() => navigate(`/update/${item._id}`)}
                          className='btn btn-circle btn-ghost hover:bg-blue-50 hover:text-blue-600 transition-colors'
                        >
                          <SquarePen size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>


  )
}

export default ListProducts