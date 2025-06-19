import { useState, useEffect } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { Plus, Trash2, Edit, Save, X } from 'lucide-react'
import { toast } from 'react-hot-toast'

const AddCategories = ({ token }) => {
  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [newCategory, setNewCategory] = useState('')
  const [newSubCategory, setNewSubCategory] = useState('')
  const [editMode, setEditMode] = useState({ type: '', id: null, name: '' })
  const [loading, setLoading] = useState(false)

  // Fetch categories and subcategories
  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${backendUrl}/api/category/listcategories`)
      if (response.data.success) {
        setCategories(response.data.categories)
      } else {
        toast.error(response.data.message || 'Không thể tải danh mục')
      }
      setLoading(false)
    } catch (error) {
      toast.error('Không thể tải danh mục')
      setLoading(false)
    }
  }

  const fetchSubCategories = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${backendUrl}/api/category/listsubcategories`)
      if (response.data.success) {
        setSubCategories(response.data.subcategories)
      } else {
        toast.error(response.data.message || 'Không thể tải danh mục con')
      }
      setLoading(false)
    } catch (error) {
      toast.error('Không thể tải danh mục con')
      setLoading(false)
    }
  }

  // Add new category
  const addCategory = async () => {
    if (!newCategory.trim()) {
      toast.error('Tên danh mục không được để trống')
      return
    }

    try {
      setLoading(true)
      const response = await axios.post(
        `${backendUrl}/api/category/addcategory`,
        { name: newCategory },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (response.data.success) {
        fetchCategories() // Refresh the list
        setNewCategory('')
        toast.success('Thêm danh mục thành công')
      } else {
        toast.error(response.data.message || 'Không thể thêm danh mục')
      }
      setLoading(false)
    } catch (error) {
      toast.error('Không thể thêm danh mục')
      setLoading(false)
    }
  }

  // Add new subcategory
  const addSubCategory = async () => {
    if (!newSubCategory.trim()) {
      toast.error('Tên danh mục con không được để trống')
      return
    }

    try {
      setLoading(true)
      const response = await axios.post(
        `${backendUrl}/api/category/addsubcategory`,
        { name: newSubCategory },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (response.data.success) {
        fetchSubCategories() // Refresh the list
        setNewSubCategory('')
        toast.success('Thêm danh mục con thành công')
      } else {
        toast.error(response.data.message || 'Không thể thêm danh mục con')
      }
      setLoading(false)
    } catch (error) {
      toast.error('Không thể thêm danh mục con')
      setLoading(false)
    }
  }

  const deleteCategory = async (id) => {
    try {
      const response = await axios.post(backendUrl + `/api/category/deletecategory/${id}`)
      if (response.data.success) {
        toast.success(response.data.message)
        await fetchCategories()
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  const deleteSubCategory = async (id) => {
    try {
      const response = await axios.post(backendUrl + `/api/category/deletesubcategory/${id}`)
      if (response.data.success) {
        toast.success(response.data.message)
        await fetchSubCategories()
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchCategories()
    fetchSubCategories()
  }, [])

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Quản lý danh mục sản phẩm</h1>
      
      {/* Categories Section */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Danh mục chính</h2>
        
        {/* Add new category */}
        <div className="flex mb-6">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Tên danh mục mới"
            className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addCategory}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 flex items-center disabled:opacity-50"
          >
            <Plus size={18} className="mr-1" /> Thêm
          </button>
        </div>
        
        {/* Categories list */}
        <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
          {loading && categories.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Đang tải...</p>
          ) : categories.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Chưa có danh mục nào</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {categories.map((category) => (
                <li key={category._id} className="py-3 flex items-center justify-between">
                  {editMode.type === 'category' && editMode.id === category._id ? (
                    <div className="flex flex-1 mr-2">
                      <input
                        type="text"
                        value={editMode.name}
                        onChange={(e) => setEditMode({...editMode, name: e.target.value})}
                        className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button 
                        onClick={saveEdit}
                        className="bg-green-600 text-white p-2 rounded-md ml-2 hover:bg-green-700"
                      >
                        <Save size={18} />
                      </button>
                      <button 
                        onClick={() => setEditMode({ type: '', id: null, name: '' })}
                        className="bg-gray-600 text-white p-2 rounded-md ml-2 hover:bg-gray-700"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="text-gray-700 font-medium">{category.name}</span>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => deleteCategory(category._id)}
                          className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      {/* Subcategories Section - completely independent from categories */}
      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Danh mục con</h2>
        
        {/* Add new subcategory */}
        <div className="flex mb-6">
          <input
            type="text"
            value={newSubCategory}
            onChange={(e) => setNewSubCategory(e.target.value)}
            placeholder="Tên danh mục con mới"
            className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addSubCategory}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 flex items-center disabled:opacity-50"
          >
            <Plus size={18} className="mr-1" /> Thêm
          </button>
        </div>
        
        {/* Subcategories list */}
        <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
          {loading && subCategories.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Đang tải...</p>
          ) : subCategories.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Chưa có danh mục con nào</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {subCategories.map((subCategory) => (
                <li key={subCategory._id} className="py-3 flex items-center justify-between">
                  {editMode.type === 'subcategory' && editMode.id === subCategory._id ? (
                    <div className="flex flex-1 mr-2">
                      <input
                        type="text"
                        value={editMode.name}
                        onChange={(e) => setEditMode({...editMode, name: e.target.value})}
                        className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button 
                        onClick={saveEdit}
                        className="bg-green-600 text-white p-2 rounded-md ml-2 hover:bg-green-700"
                      >
                        <Save size={18} />
                      </button>
                      <button 
                        onClick={() => setEditMode({ type: '', id: null, name: '' })}
                        className="bg-gray-600 text-white p-2 rounded-md ml-2 hover:bg-gray-700"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="text-gray-700 font-medium">{subCategory.name}</span>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => deleteSubCategory(subCategory._id)}
                          className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default AddCategories
