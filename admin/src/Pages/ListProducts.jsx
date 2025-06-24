import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl } from "../App";
import toast from "react-hot-toast";
import { Trash2, SquarePen, Package, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ListProducts = ({ token }) => {
  const [list, setList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setList(response.data.products);
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

  const removeProduct = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        const response = await axios.post(
          backendUrl + "/api/product/remove",
          { id },
          { headers: { token } }
        );

        if (response.data.success) {
          toast.success("Xóa sản phẩm thành công");
          await fetchList();
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const formatCurrency = (amount) => {
    const formatted = amount.toLocaleString("vi-VN");
    return formatted.replace(/\./g, ",") + " VNĐ";
  };

  const getDisplayPrice = (item) => {
    const now = Date.now();
    if (
      item.promo_price &&
      item.promo_start &&
      item.promo_end &&
      new Date(item.promo_start) <= now &&
      now <= new Date(item.promo_end)
    ) {
      return item.promo_price;
    }
    return item.selling_price;
  };

  const isPromoActive = (item) => {
    const now = Date.now();
    return (
      item.promo_price &&
      item.promo_start &&
      item.promo_end &&
      new Date(item.promo_start) <= now &&
      now <= new Date(item.promo_end)
    );
  };

  // Filter products based on search and category
  const filteredProducts = list.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "" || product.category?.name === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter
  const categories = [
    ...new Set(list.map((product) => product.category?.name).filter(Boolean)),
  ];

  useEffect(() => {
    fetchList();
  }, []);

  if (loading) {
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
            <div>
              <h1 className="text-3xl font-bold text-black">
                Danh sách sản phẩm
              </h1>
              <p className="text-gray-600 mt-1">
                Quản lý tất cả sản phẩm trong cửa hàng
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-gray-100 px-4 py-2 rounded-lg border border-gray-200">
                <span className="text-black font-semibold">
                  Tổng: {list.length} sản phẩm
                </span>
              </div>
              <button
                onClick={() => navigate("/add")}
                className="btn-primary px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <Package size={16} />
                <span>Thêm sản phẩm</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="card">
        <div className="card-body">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-10"
                />
              </div>
            </div>
            <div className="md:w-64">
              <div className="relative">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="form-select pl-10"
                >
                  <option value="">Tất cả danh mục</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-black">
            Kết quả: {filteredProducts.length} sản phẩm
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Tên</th>
                <th>Danh mục</th>
                <th>Tổng tồn kho</th>
                <th>Giá bán</th>
                <th>Giá KM</th>
                <th>Giá gốc</th>
                <th>Thời gian KM</th>
                <th>Trạng thái</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((item) => (
                <tr key={item._id} className="hover">
                  <td>
                    <img
                      src={item.image[0]}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td>
                    <p className="font-bold">{item.name}</p>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      {Object.entries(item.sizes).map(([size, stock]) => (
                        <span
                          key={size}
                          className={`badge badge-sm ${
                            stock > 0 ? "badge-ghost" : "badge-error"
                          }`}
                        >
                          {size}: {stock}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div>
                      {item.category?.name || "-"}
                      {item.subCategory?.name
                        ? ` - ${item.subCategory.name}`
                        : ""}
                    </div>
                  </td>
                  <td>
                    {Object.entries(item.sizes).reduce(
                      (acc, [size, stock]) => acc + stock,
                      0
                    )}
                  </td>
                  <td>
                    <span className="font-semibold text-black">
                      {formatCurrency(item.selling_price)}
                    </span>
                  </td>
                  <td>
                    {isPromoActive(item) ? (
                      <span className="font-semibold text-red-600">
                        {formatCurrency(item.promo_price)}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td>
                    <span className="text-gray-500">
                      {formatCurrency(item.original_price)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap">
                    {item.promo_start && item.promo_end ? (
                      <span className="text-xs text-gray-600">
                        {new Date(item.promo_start).toLocaleString()}
                        <br />
                        đến
                        <br />
                        {new Date(item.promo_end).toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        isPromoActive(item)
                          ? "bg-yellow-100 text-yellow-800"
                          : item.sale
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {isPromoActive(item)
                        ? "Đang KM"
                        : item.sale
                        ? "🏷️ Sale"
                        : "Thường"}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => removeProduct(item._id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa sản phẩm"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button
                        onClick={() => navigate(`/update/${item._id}`)}
                        className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                        title="Chỉnh sửa sản phẩm"
                      >
                        <SquarePen size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Không tìm thấy sản phẩm
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListProducts;
