import { useEffect, useState } from 'react'
import Navbar from './Components/Navbar'
import Sidebar from './Components/Sidebar'
import {Routes, Route} from "react-router-dom"
import AddProducts from './Pages/AddProducts'
import ListProducts from './Pages/ListProducts'
import Orders from './Pages/Orders'
import Login from './Components/Login'
import { Toaster } from 'react-hot-toast';
import Overview from './Pages/Overview'
import UpdateProduct from './Pages/UpdateProduct'
import ListUser from './Pages/ListUser'
import AddCategories from './Pages/AddCategories'

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const App = () => {

  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : "")

  useEffect(() => {
    localStorage.setItem('token', token)
  }, [token])

  return (
    <div className='bg-gray-50 min-h-screen'>
      <Toaster />
      { token === "" 
        ? <Login setToken={setToken} />
        : <>
            <Navbar setToken={setToken} />
            <hr />
            <div className='flex w-full'>
              <Sidebar />
              <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base'>
              <Routes>
                <Route path='/' element={<Overview />} />
                <Route path='/add' element={<AddProducts token={token} />} />
                <Route path='/user' element={<ListUser token={token} />} />
                <Route path='/list' element={<ListProducts token={token} />} />
                <Route path='/orders' element={<Orders token={token} />} />
                <Route path='/update/:id' element={<UpdateProduct token={token} />} />
                <Route path='/category' element={<AddCategories token={token} />} />
              </Routes>
              </div>
            </div>
          </>
      }
    </div>
  )
}

export default App