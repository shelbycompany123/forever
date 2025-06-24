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
  const [sellingPrice, setSellingPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [promoPrice, setPromoPrice] = useState("");
  const [promoStart, setPromoStart] = useState("");
  const [promoEnd, setPromoEnd] = useState("");
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sizes, setSizes] = useState([{ name: "S", stock: 10 }]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (
      !name.trim() ||
      !description.trim() ||
      !sellingPrice ||
      !originalPrice
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    if (images.length === 0) {
      toast.error("Vui lòng tải lên ít nhất một hình ảnh");
      return;
    }

    const sizesObject = sizes.reduce((obj, item) => {
      if (item.name) {
        obj[item.name] = Number(item.stock) || 0;
      }
      return obj;
    }, {});

    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("selling_price", sellingPrice);
      formData.append("original_price", originalPrice);
      if (promoPrice) formData.append("promo_price", promoPrice);
      if (promoStart) formData.append("promo_start", promoStart);
      if (promoEnd) formData.append("promo_end", promoEnd);
      formData.append("category", selectedCategory);
      formData.append("subCategory", selectedSubCategory);
      formData.append("sizes", JSON.stringify(sizesObject));

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
        setSellingPrice("");
        setOriginalPrice("");
        setPromoPrice("");
        setPromoStart("");
        setPromoEnd("");
        setSizes([{ name: "S", stock: 10 }]);
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

  const handleSizeChange = (index, field, value) => {
    const newSizes = [...sizes];
    newSizes[index][field] = value;
    setSizes(newSizes);
  };

  const addSizeField = () => {
    setSizes([...sizes, { name: "", stock: 0 }]);
  };

  const removeSizeField = (index) => {
    const newSizes = sizes.filter((_, i) => i !== index);
    setSizes(newSizes);
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

            {/* Sizes */}
            <div>
              <h4 className="text-md font-semibold text-black mb-2 flex items-center gap-2">
                <Tag size={16} />
                Kích Thước & Tồn Kho
              </h4>
              <div className="space-y-4">
                {sizes.map((size, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Tên Size</span>
                      </label>
                      <input
                        type="text"
                        placeholder="VD: S, M, L..."
                        value={size.name}
                        onChange={(e) =>
                          handleSizeChange(index, "name", e.target.value)
                        }
                        className="input input-bordered"
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Số lượng</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        placeholder="VD: 10"
                        value={size.stock}
                        onChange={(e) =>
                          handleSizeChange(index, "stock", e.target.value)
                        }
                        className="input input-bordered"
                      />
                    </div>
                    <div
                      type="button"
                      onClick={() => removeSizeField(index)}
                      className="btn btn-error btn-outline mt-5"
                    >
                      <X size={16} /> Xóa
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addSizeField}
                className="btn btn-primary btn-outline mt-4"
              >
                Thêm Size
              </button>
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
                  <label className="form-label">Giá Bán *</label>
                  <input
                    onChange={(e) => setSellingPrice(e.target.value)}
                    value={sellingPrice}
                    type="number"
                    placeholder="Nhập giá bán"
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Giá Gốc *</label>
                  <input
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    value={originalPrice}
                    type="number"
                    placeholder="Nhập giá gốc"
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Giá Khuyến Mãi</label>
                  <input
                    onChange={(e) => setPromoPrice(e.target.value)}
                    value={promoPrice}
                    type="number"
                    placeholder="Nhập giá khuyến mãi (nếu có)"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Bắt đầu khuyến mãi</label>
                  <input
                    onChange={(e) => setPromoStart(e.target.value)}
                    value={promoStart}
                    type="datetime-local"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Kết thúc khuyến mãi</label>
                  <input
                    onChange={(e) => setPromoEnd(e.target.value)}
                    value={promoEnd}
                    type="datetime-local"
                    className="form-input"
                  />
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
