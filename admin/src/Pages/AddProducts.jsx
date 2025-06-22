import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import toast from "react-hot-toast";
import { Upload, Package, Tag, DollarSign, Save, X } from "lucide-react";

const AddProducts = ({ token }) => {
  const [images, setImages] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState({
    S: 0,
    M: 0,
    L: 0,
    XL: 0,
    XXL: 0,
  });
  const [sale, setSale] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!name.trim() || !description.trim() || !newPrice || !oldPrice) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    if (images.length === 0) {
      toast.error("Vui lòng tải lên ít nhất một hình ảnh");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("new_price", newPrice);
      formData.append("old_price", oldPrice);
      formData.append("category", selectedCategory);
      formData.append("subCategory", selectedSubCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("sale", sale);

      // Thêm tất cả ảnh vào mảng images
      const validImages = images.filter((img) => img);
      validImages.forEach((image) => {
        formData.append("images", image);
      });

      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        // Reset form
        setName("");
        setDescription("");
        setImages([]);
        setNewPrice("");
        setOldPrice("");
        setSizes({ S: 0, M: 0, L: 0, XL: 0, XXL: 0 });
        setBestseller(false);
        setSale(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getListCategories = async () => {
    try {
      const response = await axios.get(
        backendUrl + "/api/category/listcategories"
      );
      if (response.data.success) {
        setCategory(response.data.categories);
        if (response.data.categories.length > 0) {
          setSelectedCategory(response.data.categories[0]._id);
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getListSubCategories = async () => {
    try {
      const response = await axios.get(
        backendUrl + "/api/category/listsubcategories"
      );
      if (response.data.success) {
        setSubCategory(response.data.subcategories);
        if (response.data.subcategories.length > 0) {
          setSelectedSubCategory(response.data.subcategories[0]._id);
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleSizeChange = (size, value) => {
    setSizes((prev) => ({
      ...prev,
      [size]: parseInt(value) || 0,
    }));
  };

  useEffect(() => {
    getListCategories();
    getListSubCategories();
  }, []);

  const formatCurrency = (amount) => {
    const formatted = amount.toLocaleString("vi-VN");
    return formatted.replace(/\./g, ",") + " VNĐ";
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="card">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-black">
                Thêm sản phẩm mới
              </h1>
              <p className="text-gray-600 mt-1">
                Tạo sản phẩm mới cho cửa hàng
              </p>
            </div>
            <div className="bg-gray-100 px-4 py-2 rounded-lg border border-gray-200">
              <span className="text-black font-semibold">Sản phẩm mới</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-black flex items-center gap-2">
            <Package size={20} />
            Thông tin sản phẩm
          </h3>
        </div>
        <div className="card-body">
          <form onSubmit={onSubmitHandler} className="space-y-8">
            {/* Upload Images */}
            <div>
              <h4 className="text-md font-semibold text-black mb-4 flex items-center gap-2">
                <Upload size={16} />
                Hình Ảnh Sản Phẩm
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                  const image = images[num - 1];

                  return (
                    <div key={num} className="relative">
                      <label
                        htmlFor={`image${num}`}
                        className="cursor-pointer block"
                      >
                        <div className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg hover:border-black transition-colors relative overflow-hidden">
                          {image ? (
                            <img
                              className="w-full h-full object-cover"
                              src={URL.createObjectURL(image)}
                              alt={`Image ${num}`}
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <Upload size={24} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                      </label>
                      <input
                        onChange={(e) => {
                          if (e.target.files.length > 0) {
                            const file = e.target.files[0];
                            setImages((prev) => {
                              const newImages = [...prev];
                              newImages[num - 1] = file;
                              return newImages;
                            });
                          }
                        }}
                        type="file"
                        id={`image${num}`}
                        hidden
                        accept="image/*"
                      />
                      {image && (
                        <button
                          type="button"
                          onClick={() => {
                            setImages((prev) => {
                              const newImages = [...prev];
                              newImages[num - 1] = undefined;
                              return newImages.filter(
                                (img) => img !== undefined
                              );
                            });
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Product Information */}
            <div>
              <h4 className="text-md font-semibold text-black mb-4 flex items-center gap-2">
                <Package size={16} />
                Thông Tin Cơ Bản
              </h4>
              <div className="space-y-4">
                <div className="form-group">
                  <label className="form-label">Tên Sản Phẩm *</label>
                  <input
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    type="text"
                    placeholder="Nhập tên sản phẩm"
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Mô Tả Sản Phẩm *</label>
                  <textarea
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    placeholder="Viết mô tả sản phẩm"
                    required
                    rows="4"
                    className="form-textarea"
                  />
                </div>
              </div>
            </div>

            {/* Categories & Pricing */}
            <div>
              <h4 className="text-md font-semibold text-black mb-4 flex items-center gap-2">
                <Tag size={16} />
                Phân Loại & Giá Cả
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Danh Mục</label>
                  <select
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    value={selectedCategory}
                    className="form-select"
                  >
                    {category.map((item, index) => (
                      <option key={index} value={item._id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Phân Loại Phụ</label>
                  <select
                    onChange={(e) => setSelectedSubCategory(e.target.value)}
                    value={selectedSubCategory}
                    className="form-select"
                  >
                    {subCategory?.map((item, index) => (
                      <option key={index} value={item._id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Giá Mới *</label>
                  <input
                    onChange={(e) => setNewPrice(e.target.value)}
                    value={newPrice}
                    type="number"
                    placeholder="Nhập giá mới"
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Giá Cũ *</label>
                  <input
                    onChange={(e) => setOldPrice(e.target.value)}
                    value={oldPrice}
                    type="number"
                    placeholder="Nhập giá cũ"
                    required
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h4 className="text-md font-semibold text-black mb-4">
                Kích Thước & Số Lượng
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.keys(sizes).map((size) => (
                  <div key={size} className="form-group">
                    <label className="form-label">{size}</label>
                    <input
                      type="number"
                      value={sizes[size]}
                      onChange={(e) => handleSizeChange(size, e.target.value)}
                      className="form-input"
                      min="0"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Options */}
            <div>
              <h4 className="text-md font-semibold text-black mb-4">
                Tùy Chọn
              </h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="bestseller"
                    checked={bestseller}
                    onChange={(e) => setBestseller(e.target.checked)}
                    className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                  />
                  <label
                    htmlFor="bestseller"
                    className="text-sm font-medium text-gray-700"
                  >
                    Sản phẩm bán chạy
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="sale"
                    checked={sale}
                    onChange={(e) => setSale(e.target.checked)}
                    className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                  />
                  <label
                    htmlFor="sale"
                    className="text-sm font-medium text-gray-700"
                  >
                    Sản phẩm giảm giá
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary px-8 py-3 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={18} />
                {loading ? "Đang thêm..." : "Thêm Sản Phẩm"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProducts;
