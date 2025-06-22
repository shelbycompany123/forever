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
                <th>#</th>
                <th>Hình Ảnh</th>
                <th>Tên Sản Phẩm</th>
                <th>Danh Mục</th>
                <th>Kích Thước</th>
                <th>Giá Mới</th>
                <th>Giá Cũ</th>
                <th>Trạng Thái</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="font-medium text-gray-700">{index + 1}</td>
                  <td>
                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                      <img
                        className="w-full h-full object-cover"
                        src={item.image[0]}
                        alt={item.name}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="font-medium text-black max-w-xs truncate">
                      {item.name}
                    </div>
                  </td>
                  <td>
                    <span className="px-3 py-1 whitespace-nowrap bg-gray-100 text-black rounded-full text-sm font-medium">
                      {item?.category?.name} - {item?.subCategory?.name}
                    </span>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(item.sizes).map(([key, value], index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium"
                        >
                          {key} - {value}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span className="font-semibold text-black">
                      {formatCurrency(item.new_price)}
                    </span>
                  </td>
                  <td>
                    <span className="text-gray-500 line-through">
                      {formatCurrency(item.old_price)}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.sale
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.sale ? "🏷️ Sale" : "Thường"}
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
