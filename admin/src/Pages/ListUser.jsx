import React, { useEffect, useState } from 'react'
import { backendUrl } from '../App'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Trash2 } from 'lucide-react';

const ListUser = () => {

    const [users, setUsers] = useState([])

    const fetchUsers = async () => {
        try {
            const response = await axios.get(backendUrl + "/api/user/listuser")
            if (response.data.success) {
                setUsers(response.data.users)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchUsers();
    }, [])

  return (
    <div className='max-w-7xl mx-auto m-6'>
        {/* Header Section */}
      <div className='bg-white rounded-lg p-6 shadow-lg mb-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>List Users</h1>
            <p className='text-gray-600 mt-1'>Quản lý tất cả người dùng trong cửa hàng</p>
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
                <th className='text-gray-700 font-semibold'>Image</th>
                <th className='text-gray-700 font-semibold'>Tên</th>
                <th className='text-gray-700 font-semibold'>Email</th>
                <th className='text-gray-700 font-semibold'>Số Điện Thoại</th>
                <th className='text-gray-700 font-semibold'>Địa Chỉ</th>
                <th className='text-gray-700 font-semibold'>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <div className='w-16 h-16 rounded-lg overflow-hidden border border-gray-200'>
                        
                      </div>
                    </td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.address}</td>
                    <td>
                      <div className='flex gap-2'>
                        <button
                          className='btn btn-circle btn-ghost hover:bg-red-50 hover:text-red-600 transition-colors'
                        >
                          <Trash2 size={18} />
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

export default ListUser