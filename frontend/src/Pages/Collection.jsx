import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../Context/ShopContext'
import { assets } from '../assets/assets';
import Title from "../Component/Title"
import Item from "../Component/Item"
import axios from 'axios';
import toast from 'react-hot-toast';

const Collection = () => {

  const {product_list, search, showSearch, backendUrl} = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relavent');
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8)

  const totalPages = Math.ceil(filterProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filterProducts.slice(startIndex, endIndex)

  const selectCategoryHandler = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(prev => 
      prev.includes(categoryId) 
        ? prev.filter(item => item !== categoryId) 
        : [...prev, categoryId]
    );
  }
  
  const selectSubCategoryHandler = (e) => {
    const subCategoryId = e.target.value;
    setSelectedSubCategory(prev => 
      prev.includes(subCategoryId) 
        ? prev.filter(item => item !== subCategoryId) 
        : [...prev, subCategoryId]
    );
  }

  // Hàm lọc và sắp xếp sản phẩm
  const filterAndSortProducts = () => {
    if (!product_list || product_list.length === 0) {
      setFilterProducts([]);
      return;
    }

    let filteredList = [...product_list];
    
    // Áp dụng bộ lọc tìm kiếm nếu đang hiển thị tìm kiếm
    if (showSearch && search && search.trim() !== '') {
      filteredList = filteredList.filter(item => 
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Áp dụng bộ lọc danh mục
    if (selectedCategory.length > 0) {
      filteredList = filteredList.filter(item => {
        // Xử lý cả trường hợp category là ID hoặc là object có _id
        const categoryId = typeof item.category === 'object' && item.category !== null 
          ? item.category._id 
          : item.category;
        return selectedCategory.includes(categoryId);
      });
    }
    
    // Áp dụng bộ lọc danh mục con
    if (selectedSubCategory.length > 0) {
      filteredList = filteredList.filter(item => {
        // Xử lý cả trường hợp subCategory là ID hoặc là object có _id
        const subCategoryId = typeof item.subCategory === 'object' && item.subCategory !== null 
          ? item.subCategory._id 
          : item.subCategory;
        return selectedSubCategory.includes(subCategoryId);
      });
    }
    
    // Áp dụng sắp xếp
    switch (sortType) {
      case "low-high":
        filteredList.sort((a, b) => a.new_price - b.new_price);
        break;
      case "high-low":
        filteredList.sort((a, b) => b.new_price - a.new_price);
        break;
      default:
        // Giữ nguyên thứ tự mặc định
        break;
    }
    
    setFilterProducts(filteredList);
  }

  // Lấy danh sách danh mục
  const getListCategories = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/category/listcategories`);
      if (response.data.success) {
        setCategory(response.data.categories);
      } else {
        toast.error(response.data.message || 'Không thể tải danh mục');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error(error.message || 'Đã xảy ra lỗi khi tải danh mục');
    }
  }

  // Lấy danh sách danh mục con
  const getListSubCategories = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/category/listsubcategories`);
      if (response.data.success) {
        setSubCategory(response.data.subcategories);
      } else {
        toast.error(response.data.message || 'Không thể tải danh mục con');
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      toast.error(error.message || 'Đã xảy ra lỗi khi tải danh mục con');
    }
  } 

  // Tải danh mục và danh mục con khi component mount
  useEffect(() => {
    getListCategories();
    getListSubCategories();
  }, []);

  // Áp dụng bộ lọc và sắp xếp khi các điều kiện thay đổi
  useEffect(() => {
    filterAndSortProducts();
    setCurrentPage(1);
  }, [product_list, selectedCategory, selectedSubCategory, sortType, search, showSearch]);

  useEffect(() => {
    window.scrollTo({top: 0, behavior: 'smooth'})
  }, [currentPage])

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>

      {/* Bộ lọc sản phẩm */}
      <div className='min-w-60'>
        <p onClick={() => setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>FILTERS
          <img className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} src={assets.dropdown_icon} alt="" />
        </p>
        
        {/* Category Filter */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden' } sm:block`}>
          <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            {category.map((item, index) => {
              return (
                <p key={item._id || index} className='flex gap-2'>
                  <input 
                    onChange={selectCategoryHandler} 
                    className='w-3' 
                    type="checkbox" 
                    value={item._id}
                    checked={selectedCategory.includes(item._id)}
                  /> 
                  {item.name}
                </p>
              )
            })}
          </div>
        </div>

        {/* SubCategory Filter */}
        <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden' } sm:block`}>
          <p className='mb-3 text-sm font-medium'>TYPE</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            {subCategory.map((item, index) => {
              return (
                <p key={item._id || index} className='flex gap-2'>
                  <input 
                    onChange={selectSubCategoryHandler} 
                    className='w-3' 
                    type="checkbox" 
                    value={item._id}
                    checked={selectedSubCategory.includes(item._id)}
                  /> 
                  {item.name}
                </p>
              )
            })}
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className='flex-1'>
        <div className='flex justify-between text-base sm:text-2xl mb-4'>
          <Title text1={'ALL'} text2={'COLLECTION'} />
          <select 
            onChange={(e) => setSortType(e.target.value)} 
            value={sortType}
            className="border-2 border-gray-300 text-sm px-2"
          >
            <option value="relavent">Sort by: Relavent</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* Map Products */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {currentItems.length > 0 ? (
              currentItems.map((item, index) => (
              <Item 
                key={item._id || index}
                id={item._id}
                name={item.name}
                image={item.image}
                new_price={item.new_price}
                old_price={item.old_price}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-gray-500">
              Không tìm thấy sản phẩm phù hợp
            </div>
          )}
        </div>
        {/* Pagination */}
          <div className="flex flex-col items-center mt-20 gap-3">
          {/* Tổng sản phẩm */}
          <div className="text-sm text-gray-600">
            Hiển thị {currentItems.length} / {filterProducts.length} sản phẩm
          </div>

          {/* Pagination Buttons */}
          <div className="join">
            {/* Nút Previous */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="join-item btn"
              disabled={currentPage === 1}
            >
              «
            </button>

            {/* Các nút số trang */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`join-item btn ${currentPage === page ? "btn-active" : ""}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            {/* Nút Next */}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="join-item btn"
              disabled={currentPage === totalPages}
            >
              »
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Collection