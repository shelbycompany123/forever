import React, { useState } from 'react'
import axios from "axios"
import { backendUrl } from '../App';
import toast from 'react-hot-toast';

const Login = ({setToken}) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            const response = await axios.post(backendUrl + "/api/user/admin", {email, password})
            if (response.data.success) {
                toast.success("Đăng nhập thành công")
                setToken(response.data.token)
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {  
            console.log(error);
            toast.error(error.message);
        }
    }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Admin Panel</h1>
        <form onSubmit={onSubmitHandler} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
                onChange={(e) => setEmail(e.target.value)} 
                value={email}
              type="email"
              placeholder="Enter your email"
              required
              autoComplete="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
                onChange={(e) => setPassword(e.target.value)} 
                value={password}
              type="password"
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="mt-2 w-full py-2 px-4 rounded-md text-white bg-black">
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
