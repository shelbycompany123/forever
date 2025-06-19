import React, { useEffect, useState } from 'react'
import {useParams, useNavigate, data} from "react-router-dom"
import axios from "axios"
import {backendUrl} from "../App"
import toast from 'react-hot-toast'

const UpdateProduct = ({token}) => {

  const {id} = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState([])
  const [subCategory, setSubCategory] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    new_price: "",
    old_price: "",
    category: "",
    subCategory: "",
    bestseller: false,
    sale: false,
    sizes: [],
    image: []
  })

  useEffect(() => {
    axios.get(backendUrl + `/api/product/get/${id}`)
      .then((res) => {
        if (res.data.success) {
          setFormData(res.data.data);
        }
      })
      .catch((err) => console.log(err))
  }, [id]);

  const onChangeHandler = (event) => {
    setFormData({...formData, [event.target.name]: event.target.value})
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const newForm = new FormData()
      newForm.append("name", formData.name)
      newForm.append("description", formData.description)
      newForm.append("new_price", formData.new_price)
      newForm.append("old_price", formData.old_price)
      newForm.append("category", selectedCategory)
      newForm.append("subCategory", selectedSubCategory)
      newForm.append("bestseller", formData.bestseller)
      newForm.append("sizes", JSON.stringify(formData.sizes))
      newForm.append("sale", formData.sale)
      newForm.append("currentImageCount", formData.image.length)

      // Append images - chỉ append những ảnh đã được thay đổi (File objects)
      formData.image.forEach((img, index) => {
        if (img && typeof img !== 'string') {
          // Đây là file mới được chọn
          newForm.append(`image${index + 1}`, img)
        }
      })

      const res = await axios.put(backendUrl + `/api/product/update/${id}`, newForm, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'token': token
        }
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate('/list')
      } else {
        toast.error(res.data.message)
      }
    } catch (error) {
      toast.error(error.message || "Có lỗi xảy ra")
      console.error(error);
    }
  }
  console.log(formData)

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

  useEffect(() => {
    getListCategories();
    getListSubCategories();
  }, [])

  return (
    <div className='max-w-4xl mx-auto m-6'>
      {/* Header Section */}
      <div className='bg-white rounded-lg p-6 shadow-lg mb-6'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-800'>Cập Nhật Sản Phẩm</h1>
          <p className='text-gray-600 mt-1'>Chỉnh sửa thông tin sản phẩm của bạn</p>
        </div>
      </div>

      {/* Form Section */}
      <div className='bg-white rounded-lg shadow-lg p-6'>
        <form onSubmit={onSubmitHandler} className='space-y-6' encType='multipart/form-data'>

          {/* Upload Images */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Hình Ảnh Sản Phẩm</h3>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              {formData.image && formData.image.map((img, index) => {
                return (
                  <div key={index} className='relative'>
                    <label htmlFor={`img${index}`} className='cursor-pointer relative block'>
                      <img
                        className='w-full h-24 object-cover border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors'
                        src={typeof img !== 'string' ? URL.createObjectURL(img) : img}
                        alt={`Product image ${index + 1}`}
                      />
                      <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity rounded-lg'>
                        <span className='text-white text-xs'>Thay đổi</span>
                      </div>
                      <input
                        onChange={(e) => {
                          if (e.target.files[0]) {
                            const newList = [...formData.image]
                            newList[index] = e.target.files[0]
                            setFormData({...formData, image: newList})
                          }
                        }}
                        type="file"
                        id={`img${index}`}
                        accept="image/*"
                        hidden
                      />
                    </label>
                    {/* Nút xóa ảnh */}
                    <button
                      type="button"
                      onClick={() => {
                        const newList = formData.image.filter((_, i) => i !== index)
                        setFormData({...formData, image: newList})
                      }}
                      className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors'
                    >
                      ×
                    </button>
                  </div>
                )
              })}

              {/* Nút thêm ảnh mới nếu chưa đủ 4 ảnh */}
              {formData.image && formData.image.length < 4 && (
                <label htmlFor="addNewImg" className='cursor-pointer'>
                  <div className='w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-blue-400 transition-colors'>
                    <span className='text-gray-500 text-xs text-center'>Thêm ảnh</span>
                  </div>
                  <input
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        const newList = [...formData.image, e.target.files[0]]
                        setFormData({...formData, image: newList})
                      }
                    }}
                    type="file"
                    id="addNewImg"
                    accept="image/*"
                    hidden
                  />
                </label>
              )}
            </div>
          </div>

          {/* Product Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Thông Tin Sản Phẩm</h3>
            <div className='space-y-4'>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Tên Sản Phẩm</label>
                <input onChange={onChangeHandler} name='name' value={formData.name || ''} required className='w-full border border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:outline-none transition-colors'/>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Mô Tả Sản Phẩm</label>
                <textarea onChange={onChangeHandler} name='description' value={formData.description || ''} required rows="3" className='w-full border border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:outline-none transition-colors resize-none'/>
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
                <input onChange={onChangeHandler} name='new_price' value={formData.new_price} type="Number" placeholder='0' className='w-full border border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:outline-none transition-colors' />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Giá Cũ</label>
                <input onChange={onChangeHandler} name='old_price' value={formData.old_price} type="Number" placeholder='0' className='w-full border border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:outline-none transition-colors' />
              </div>
            </div>
          </div>

          <div className='bg-gray-50 p-3 rounded-lg mt-3'>
            <div className='flex items-center gap-3'>
              <input 
                onChange={() => setFormData(prev => ({...prev, sale: !prev.sale}))} 
                checked={formData.sale} 
                type="checkbox" 
                id='sale' 
                className='w-4 h-4 text-red-600' 
              />
              <label className='text-sm font-medium cursor-pointer text-gray-700' htmlFor="sale">
                🏷️ Thêm vào danh sách Sale
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className='pt-4'>
            <button type='submit' className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg'>
              Cập Nhật Sản Phẩm
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UpdateProduct