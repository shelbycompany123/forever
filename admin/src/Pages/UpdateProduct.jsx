import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../App";
import toast from "react-hot-toast";
import { Upload, Package, Tag, Save, X, ArrowLeft, Edit } from "lucide-react";

const UpdateProduct = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

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
    image: [],
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setInitialLoading(true);
        const res = await axios.get(backendUrl + `/api/product/get/${id}`);
        if (res.data.success) {
          const productData = res.data.data;
          const sizesArray = Object.entries(productData.sizes || {}).map(
            ([name, stock]) => ({ name, stock })
          );
          setFormData({ ...productData, sizes: sizesArray });
          setSelectedCategory(productData.category?._id || "");
          setSelectedSubCategory(productData.subCategory?._id || "");
        } else {
          toast.error("Không thể tải thông tin sản phẩm");
          navigate("/list");
        }
      } catch (err) {
        console.log(err);
        toast.error("Có lỗi xảy ra khi tải sản phẩm");
        navigate("/list");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const onChangeHandler = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSizeChange = (index, field, value) => {
    const newSizes = [...formData.sizes];
    newSizes[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      sizes: newSizes,
    }));
  };

  const addSizeField = () => {
    setFormData((prev) => ({
      ...prev,
      sizes: [...prev.sizes, { name: "", stock: 0 }],
    }));
  };

  const removeSizeField = (index) => {
    const newSizes = formData.sizes.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      sizes: newSizes,
    }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.new_price ||
      !formData.old_price
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    if (!formData.image || formData.image.length === 0) {
      toast.error("Vui lòng tải lên ít nhất một hình ảnh");
      return;
    }

    const sizesObject = formData.sizes.reduce((obj, item) => {
      if (item.name) {
        obj[item.name] = Number(item.stock) || 0;
      }
      return obj;
    }, {});

    try {
      setLoading(true);
      const newForm = new FormData();
      newForm.append("name", formData.name);
      newForm.append("description", formData.description);
      newForm.append("new_price", formData.new_price);
      newForm.append("old_price", formData.old_price);
      newForm.append("category", selectedCategory);
      newForm.append("subCategory", selectedSubCategory);
      newForm.append("bestseller", formData.bestseller);
      newForm.append("sizes", JSON.stringify(sizesObject));
      newForm.append("sale", formData.sale);

      // Append images - chỉ append những ảnh đã được thay đổi (File objects)
      const newImages = [];
      const currentImages = [];

      formData.image.forEach((img, index) => {
        if (img && typeof img !== "string") {
          // Đây là file mới được chọn
          newImages.push(img);
        } else if (img && typeof img === "string") {
          // Đây là ảnh hiện tại (URL)
          currentImages.push(img);
        }
      });

      // Gửi thông tin về ảnh hiện tại
      newForm.append("currentImageCount", currentImages.length);

      // Gửi tất cả ảnh mới
      newImages.forEach((image) => {
        newForm.append("images", image);
      });

      const res = await axios.put(
        backendUrl + `/api/product/update/${id}`,
        newForm,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token: token,
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/list");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message || "Có lỗi xảy ra");
      console.error(error);
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
        if (response.data.categories.length > 0 && !selectedCategory) {
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
        if (response.data.subcategories.length > 0 && !selectedSubCategory) {
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

  useEffect(() => {
    getListCategories();
    getListSubCategories();
  }, []);

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="card">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/list")}
                className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                title="Quay lại"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-black">
                  Cập nhật sản phẩm
                </h1>
                <p className="text-gray-600 mt-1">
                  Chỉnh sửa thông tin sản phẩm
                </p>
              </div>
            </div>
            <div className="bg-gray-100 px-4 py-2 rounded-lg border border-gray-200">
              <span className="text-black font-semibold">
                ID: {id?.slice(-8)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-black flex items-center gap-2">
            <Edit size={20} />
            Thông tin sản phẩm
          </h3>
        </div>
        <div className="card-body">
          <form
            onSubmit={onSubmitHandler}
            className="space-y-8"
            encType="multipart/form-data"
          >
            {/* Upload Images */}
            <div>
              <h4 className="text-md font-semibold text-black mb-4 flex items-center gap-2">
                <Upload size={16} />
                Hình Ảnh Sản Phẩm
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.image &&
                  formData.image.map((img, index) => (
                    <div key={index} className="relative">
                      <label
                        htmlFor={`img${index}`}
                        className="cursor-pointer relative block"
                      >
                        <div className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg hover:border-black transition-colors relative overflow-hidden">
                          <img
                            className="w-full h-full object-cover"
                            src={
                              typeof img !== "string"
                                ? URL.createObjectURL(img)
                                : img
                            }
                            alt={`Product image ${index + 1}`}
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                            <span className="text-white text-xs">Thay đổi</span>
                          </div>
                        </div>
                        <input
                          onChange={(e) => {
                            if (e.target.files[0]) {
                              const newList = [...formData.image];
                              newList[index] = e.target.files[0];
                              setFormData({ ...formData, image: newList });
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
                          const newList = formData.image.filter(
                            (_, i) => i !== index
                          );
                          setFormData({ ...formData, image: newList });
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}

                {/* Nút thêm ảnh mới nếu chưa đủ 10 ảnh */}
                {formData.image && formData.image.length < 10 && (
                  <label htmlFor="addNewImg" className="cursor-pointer">
                    <div className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-black transition-colors">
                      <div className="text-center">
                        <Upload
                          size={24}
                          className="text-gray-400 mx-auto mb-1"
                        />
                        <span className="text-gray-500 text-xs">Thêm ảnh</span>
                      </div>
                    </div>
                    <input
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          const newList = [
                            ...formData.image,
                            e.target.files[0],
                          ];
                          setFormData({ ...formData, image: newList });
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
              <h4 className="text-md font-semibold text-black mb-4 flex items-center gap-2">
                <Package size={16} />
                Thông Tin Cơ Bản
              </h4>
              <div className="space-y-4">
                <div className="form-group">
                  <label className="form-label">Tên Sản Phẩm *</label>
                  <input
                    onChange={onChangeHandler}
                    name="name"
                    value={formData.name || ""}
                    required
                    className="form-input"
                    placeholder="Nhập tên sản phẩm"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Mô Tả Sản Phẩm *</label>
                  <textarea
                    onChange={onChangeHandler}
                    name="description"
                    value={formData.description || ""}
                    required
                    rows="4"
                    className="form-textarea"
                    placeholder="Viết mô tả sản phẩm"
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
                {formData.sizes.map((size, index) => (
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
                    <button
                      type="button"
                      onClick={() => removeSizeField(index)}
                      className="btn btn-error btn-outline mt-9"
                    >
                      <X size={16} /> Xóa
                    </button>
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
                  <label className="form-label">Giá Mới *</label>
                  <input
                    onChange={onChangeHandler}
                    name="new_price"
                    value={formData.new_price}
                    type="number"
                    placeholder="Nhập giá mới"
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Giá Cũ *</label>
                  <input
                    onChange={onChangeHandler}
                    name="old_price"
                    value={formData.old_price}
                    type="number"
                    placeholder="Nhập giá cũ"
                    required
                    className="form-input"
                  />
                </div>
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
                    checked={formData.bestseller}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        bestseller: e.target.checked,
                      }))
                    }
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
                    checked={formData.sale}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        sale: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                  />
                  <label
                    htmlFor="sale"
                    className="text-sm font-medium text-gray-700"
                  >
                    🏷️ Sản phẩm giảm giá
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate("/list")}
                className="btn-secondary px-6 py-3 rounded-lg"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary px-8 py-3 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={18} />
                {loading ? "Đang cập nhật..." : "Cập Nhật Sản Phẩm"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;
