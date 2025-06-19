import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets';
import axios from "axios" 
import {backendUrl} from "../App"
import toast from 'react-hot-toast';

const AddProducts = ({token}) => {

    const [image1, setImage1] = useState(false)
    const [image2, setImage2] = useState(false)
    const [image3, setImage3] = useState(false)
    const [image4, setImage4] = useState(false)

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [newPrice, setNewPrice] = useState("");
    const [oldPrice, setOldPrice] = useState("");
    const [category, setCategory] = useState([]);
    const [subCategory, setSubCategory] = useState([]);
    const [bestseller, setBestseller] = useState(false);
    // const [sizes, setSizes] = useState([]);
    const [sizes, setSizes] = useState({
      S: 0,
      M: 0,
      L: 0,
      XL: 0,
      XXL: 0
    });
    const [sale, setSale] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubCategory, setSelectedSubCategory] = useState('');

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData()

            formData.append("name", name)
            formData.append("description", description)
            formData.append("new_price", newPrice)
            formData.append("old_price", oldPrice)
            formData.append("category", selectedCategory)
            formData.append("subCategory", selectedSubCategory)
            formData.append("bestseller", bestseller)
            formData.append("sizes", JSON.stringify(sizes))
            formData.append("sale", sale)

            image1 && formData.append("image1", image1)
            image2 && formData.append("image2", image2)
            image3 && formData.append("image3", image3)
            image4 && formData.append("image4", image4)

            const response = await axios.post(backendUrl + "/api/product/add", formData, {headers: {token}})

            if (response.data.success) {
                toast.success(response.data.message)
                setName("")
                setDescription("")
                setImage1(false)
                setImage2(false)
                setImage3(false)
                setImage4(false)
                setNewPrice("")
                setOldPrice("")
            } else {
                toast.error(response.data.message)
            }

        } catch (error) {   
            console.log(error);
            toast.error(error.message)
        }
    }

    const getListCategories = async () => {
        try {
            const response = await axios.get(backendUrl + "/api/category/listcategories")
            if (response.data.success) {
                setCategory(response.data.categories)
                setSelectedCategory(response.data.categories[0]._id)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    const getListSubCategories = async () => {
        try {
            const response = await axios.get(backendUrl + "/api/category/listsubcategories")
            if (response.data.success) {
                setSubCategory(response.data.subcategories)
                setSelectedSubCategory(response.data.subcategories[0]._id)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    console.log(category, subCategory);

    useEffect(() => {
        getListCategories();
        getListSubCategories();
    }, [])

    console.log();
    

    const formatCurrency = (amount) => {
      const formatted = amount.toLocaleString('vi-VN');
      return formatted.replace(/\./g, ',') + ' VNĐ';
    };

  return (
    <div className='max-w-7xl mx-auto m-6'>
      {/* Header Section */}
      <div className='bg-white rounded-lg p-6 shadow-lg mb-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>Add Products</h1>
            <p className='text-gray-600 mt-1'>Quản lý tất cả sản phẩm trong cửa hàng</p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className='bg-white rounded-lg shadow-lg p-6'>
        <form onSubmit={onSubmitHandler} className='space-y-6'>

          {/* Upload Images */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Hình Ảnh Sản Phẩm</h3>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              <label htmlFor="image1" className='cursor-pointer'>
                <img className='w-full h-24 object-cover border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors' src={!image1 ? assets.upload_area : URL.createObjectURL(image1) } alt="" />
                <input onChange={(e) => setImage1(e.target.files[0]) } type="file" id="image1" hidden />
              </label>
              <label htmlFor="image2" className='cursor-pointer'>
                <img className='w-full h-24 object-cover border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors' src={!image2 ? assets.upload_area : URL.createObjectURL(image2) } alt="" />
                <input onChange={(e) => setImage2(e.target.files[0]) } type="file" id="image2" hidden />
              </label>
              <label htmlFor="image3" className='cursor-pointer'>
                <img className='w-full h-24 object-cover border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors' src={!image3 ? assets.upload_area : URL.createObjectURL(image3) } alt="" />
                <input onChange={(e) => setImage3(e.target.files[0]) } type="file" id="image3" hidden />
              </label>
              <label htmlFor="image4" className='cursor-pointer'>
                <img className='w-full h-24 object-cover border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors' src={!image4 ? assets.upload_area : URL.createObjectURL(image4) } alt="" />
                <input onChange={(e) => setImage4(e.target.files[0]) } type="file" id="image4" hidden />
              </label>
            </div>
          </div>

          {/* Product Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Thông Tin Sản Phẩm</h3>
            <div className='space-y-4'>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Tên Sản Phẩm</label>
                <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder='Nhập tên sản phẩm' required className='w-full border border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:outline-none transition-colors' />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Mô Tả Sản Phẩm</label>
                <textarea onChange={(e) => setDescription(e.target.value)} value={description} placeholder='Viết mô tả sản phẩm' required rows="3" className='w-full border border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:outline-none transition-colors resize-none' />
              </div>
            </div>
          </div>

          {/* Categories & Pricing */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Phân Loại & Giá Cả</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Danh Mục</label>
                <select onChange={(e) => setSelectedCategory(e.target.value)} value={selectedCategory} className='w-full border border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:outline-none transition-colors'>
                  {category.map((item, index) => {
                    return (
                      <option key={index} value={item._id}>{item.name}</option>
                    )
                  })}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Phân Loại Phụ</label>
                <select onChange={(e) => setSelectedSubCategory(e.target.value)} value={selectedSubCategory} className='w-full border border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:outline-none transition-colors'>
                  {subCategory?.map((item, index) => {
                    return (
                      <option key={index} value={item._id}>{item.name}</option>
                    )
                  })}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Giá Mới</label>
                <input onChange={(e) => setNewPrice(e.target.value)} value={newPrice} type="Number" placeholder='0' className='w-full border border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:outline-none transition-colors' />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Giá Cũ</label>
                <input onChange={(e) => setOldPrice(e.target.value)} value={oldPrice} type="Number" placeholder='0' className='w-full border border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:outline-none transition-colors' />
              </div>
            </div>
          </div>

          {/* Sizes & Options */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Kích Thước & Tùy Chọn</h3>

            <div className='mb-4'>
              <label className="block text-sm font-medium mb-2 text-gray-700">Kích Thước</label>
              {/* <div className='flex flex-wrap gap-3'>
                <div onClick={() => setSizes(prev => prev.includes("S") ? prev.filter(item => item !== "S") : [...prev,"S"])} className={`${sizes.includes("S") ? "bg-blue-500 text-white" : "bg-white text-gray-700"} border border-gray-300 px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-500 hover:text-white transition-colors font-medium`}> <p>S</p> </div>
                <div onClick={() => setSizes(prev => prev.includes("M") ? prev.filter(item => item !== "M") : [...prev,"M"])} className={`${sizes.includes("M") ? "bg-blue-500 text-white" : "bg-white text-gray-700"} border border-gray-300 px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-500 hover:text-white transition-colors font-medium`}> <p>M</p> </div>
                <div onClick={() => setSizes(prev => prev.includes("L") ? prev.filter(item => item !== "L") : [...prev,"L"])} className={`${sizes.includes("L") ? "bg-blue-500 text-white" : "bg-white text-gray-700"} border border-gray-300 px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-500 hover:text-white transition-colors font-medium`}> <p>L</p> </div>
                <div onClick={() => setSizes(prev => prev.includes("XL") ? prev.filter(item => item !== "XL") : [...prev,"XL"])} className={`${sizes.includes("XL") ? "bg-blue-500 text-white" : "bg-white text-gray-700"} border border-gray-300 px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-500 hover:text-white transition-colors font-medium`}> <p>XL</p> </div>
                <div onClick={() => setSizes(prev => prev.includes("XXL") ? prev.filter(item => item !== "XXL") : [...prev,"XXL"])} className={`${sizes.includes("XXL") ? "bg-blue-500 text-white" : "bg-white text-gray-700"} border border-gray-300 px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-500 hover:text-white transition-colors font-medium`}> <p>XXL</p> </div>
              </div> */}
              <div className='flex flex-wrap gap-3'>
                {["S", "M", "L", "XL", "XXL"].map((size) => (
                <div key={size} className="flex items-center gap-2">
                  <label className="w-10 font-medium text-gray-700">{size}</label>
                  <input
                    type="number"
                    min="0"
                    value={sizes[size]}
                    onChange={(e) =>
                      setSizes((prev) => ({ ...prev, [size]: parseInt(e.target.value) || 0 }))
                    }
                    className="w-24 border border-gray-300 rounded-lg p-2"
                  />
                </div>
              ))}
              </div>
            </div>

            <div className='bg-gray-50 p-3 rounded-lg'>
              <div className='flex items-center gap-3'>
                <input onChange={() => setBestseller(prev => !prev)} checked={bestseller} type="checkbox" id='bestseller' className='w-4 h-4 text-blue-600' />
                <label className='text-sm font-medium cursor-pointer text-gray-700' htmlFor="bestseller">Thêm vào danh sách Best Seller</label>
              </div>
            </div>

            <div className='bg-gray-50 p-3 rounded-lg'>
              <div className='flex items-center gap-3'>
                <input onChange={() => setSale(prev => !prev)} checked={sale} type="checkbox" id='sale' className='w-4 h-4 text-blue-600' />
                <label className='text-sm font-medium cursor-pointer text-gray-700' htmlFor="sale">Thêm vào danh sách Sale</label>
              </div>
            </div>

          </div>

          {/* Submit Button */}
          <div className='pt-4'>
            <button type='submit' className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg'>
              Thêm Sản Phẩm
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default AddProducts;
