import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../Context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../Component/Title";
import Item from "../Component/Item";
import axios from "axios";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
const Collection = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { search, showSearch, backendUrl } = useContext(ShopContext);

  const [showFilter, setShowFilter] = useState(false);

  const [filterProducts, setFilterProducts] = useState([]);

  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);

  const sortType = searchParams.get("sort") || "desc";

  const selectedCategory = searchParams.get("category") || "";

  const selectedSubCategory = searchParams.get("subCategory") || "";

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = searchParams.get("limit") || 12;

  const totalPages = Math.ceil(filterProducts.length / itemsPerPage);

  const selectHandler = (e, type) => {
    const urlParams = new URLSearchParams(searchParams);
    const currentCategories =
      urlParams.get(type)?.split(",").filter(Boolean) || [];
    const selectedValue = e.target.value;

    if (currentCategories.includes(selectedValue)) {
      const newCategories = currentCategories.filter(
        (cat) => cat !== selectedValue
      );
      if (newCategories.length > 0) {
        urlParams.set(type, newCategories.join(","));
      } else {
        urlParams.delete(type);
      }
    } else {
      const newCategories = [...currentCategories, selectedValue];
      urlParams.set(type, newCategories.join(","));
    }

    setSearchParams(urlParams);
  };

  useEffect(() => {
    const getListCategories = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/category/listcategories`
        );
        if (response.data.success) {
          setCategory(response.data.categories);
        } else {
          toast.error(response.data.message || "Không thể tải danh mục");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error(error.message || "Đã xảy ra lỗi khi tải danh mục");
      }
    };

    const getListSubCategories = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/category/listsubcategories`
        );
        if (response.data.success) {
          setSubCategory(response.data.subcategories);
        } else {
          toast.error(response.data.message || "Không thể tải danh mục con");
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
        toast.error(error.message || "Đã xảy ra lỗi khi tải danh mục con");
      }
    };
    getListCategories();
    getListSubCategories();
  }, [backendUrl]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/product/filter?page=${currentPage}&limit=${itemsPerPage}&sort=${sortType}&category=${selectedCategory}&subCategory=${selectedSubCategory}`
        );
        if (response.data.success) {
          setFilterProducts(response.data);
        } else {
          toast.error(
            response.data.message || "Không thể tải danh sách sản phẩm"
          );
        }
      } catch {
        toast.error("Lỗi khi tải danh sách sản phẩm");
      }
    };
    fetchProducts();
  }, [
    backendUrl,
    currentPage,
    itemsPerPage,
    sortType,
    selectedCategory,
    selectedSubCategory,
  ]);

  console.log(selectedSubCategory);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* Bộ lọc sản phẩm */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          BỘ LỌC
          <img
            className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
            src={assets.dropdown_icon}
            alt=""
          />
        </p>

        {/* Category Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">DANH MỤC</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {category.map((item, index) => {
              return (
                <p key={item._id || index} className="flex gap-2">
                  <input
                    onChange={(e) => selectHandler(e, "category")}
                    className="w-3"
                    type="checkbox"
                    value={item.slug}
                  />
                  {item.name}
                </p>
              );
            })}
          </div>
        </div>

        {/* SubCategory Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 my-5 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">LOẠI</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {subCategory.map((item, index) => {
              return (
                <p key={item._id || index} className="flex gap-2">
                  <input
                    onChange={(e) => selectHandler(e, "subCategory")}
                    className="w-3"
                    type="checkbox"
                    value={item.slug}
                  />
                  {item.name}
                </p>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1={"TẤT CẢ"} text2={"BỘ SƯU TẬP"} />
          <select
            onChange={(e) => {
              const urlParams = new URLSearchParams(searchParams);
              urlParams.set("sort", e.target.value);
              setSearchParams(urlParams);
            }}
            value={sortType}
            className="border-2 border-gray-300 text-sm px-2"
          >
            <option value="desc">Sắp xếp: Giá cao đến thấp</option>
            <option value="asc">Sắp xếp: Giá thấp đến cao</option>
          </select>
        </div>

        {/* Map Products */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {filterProducts?.products?.length > 0 ? (
            filterProducts?.products?.map((item, index) => (
              <Item key={item._id || index} data={item} />
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
            Hiển thị {filterProducts?.products?.length} /{" "}
            {filterProducts.pagination?.total} sản phẩm
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
            {Array.from(
              { length: filterProducts?.pagination?.totalPages },
              (_, i) => i + 1
            ).map((page) => (
              <button
                key={page}
                className={`join-item btn ${
                  currentPage === page ? "btn-active" : ""
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            {/* Nút Next */}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className="join-item btn"
              disabled={currentPage === totalPages}
            >
              »
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;
