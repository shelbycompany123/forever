import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import toast from "react-hot-toast";
import {
  Package,
  AlertTriangle,
  Plus,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const Inventory = ({ token }) => {
  const [stats, setStats] = useState(null);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ isOpen: false, product: null });
  const [historyModal, setHistoryModal] = useState({
    isOpen: false,
    productName: "",
    history: [],
  });
  const [restockData, setRestockData] = useState({
    size: "S",
    quantity: 10,
    note: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, lowStockRes, productsRes] = await Promise.all([
        axios.get(`${backendUrl}/api/inventory/stats`, { headers: { token } }),
        axios.get(`${backendUrl}/api/inventory/low-stock`, {
          headers: { token },
        }),
        axios.get(`${backendUrl}/api/inventory`, { headers: { token } }),
      ]);
      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (lowStockRes.data.success)
        setLowStockProducts(lowStockRes.data.lowStockProducts);
      if (productsRes.data.success) {
        setAllProducts(productsRes.data.data);
        setFilteredProducts(productsRes.data.data);
      }
    } catch (error) {
      toast.error("Không thể tải dữ liệu kho");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const lowercasedTerm = searchTerm.toLowerCase();
    const filtered = allProducts.filter((product) =>
      product.name.toLowerCase().includes(lowercasedTerm)
    );
    setFilteredProducts(filtered);
  }, [searchTerm, allProducts]);

  const viewHistory = async (product) => {
    try {
      const res = await axios.get(
        `${backendUrl}/api/inventory/history/${product._id}`,
        { headers: { token } }
      );
      if (res.data.success) {
        setHistoryModal({
          isOpen: true,
          productName: product.name,
          history: res.data.data,
        });
      } else {
        toast.error("Không thể tải lịch sử sản phẩm");
      }
    } catch (error) {
      toast.error("Lỗi khi tải lịch sử sản phẩm");
    }
  };

  const handleRestock = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${backendUrl}/api/inventory/restock`,
        {
          productId: modal.product._id,
          ...restockData,
        },
        { headers: { token } }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setModal({ isOpen: false, product: null });
        fetchData();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Lỗi khi nhập kho");
    }
  };

  const openModal = (product) => {
    setModal({ isOpen: true, product });
    const defaultSize = Object.keys(product.sizes)[0] || "S";
    setRestockData({ size: defaultSize, quantity: 1, note: "" });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="card-body flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-black">Quản lý kho hàng</h1>
            <p className="text-gray-600 mt-1">
              Tổng quan và các sản phẩm sắp hết hàng.
            </p>
          </div>
          <button
            onClick={fetchData}
            className="btn-primary flex items-center gap-2 p-1 rounded-sm"
          >
            <RefreshCw size={16} />
            Làm mới
          </button>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<Package size={24} className="text-blue-600" />}
            title="Tổng sản phẩm"
            value={stats.totalProducts}
          />
          <StatCard
            icon={<TrendingUp size={24} className="text-green-600" />}
            title="Tổng tồn kho"
            value={stats.totalStock}
          />
          <StatCard
            icon={<TrendingDown size={24} className="text-orange-600" />}
            title="Sắp hết hàng"
            value={stats.lowStockCount}
          />
          <StatCard
            icon={<AlertCircle size={24} className="text-red-600" />}
            title="Hết hàng"
            value={stats.outOfStockCount}
          />
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-black flex items-center gap-2">
            <AlertTriangle className="text-orange-500" />
            Sản phẩm sắp hết hàng
          </h3>
        </div>
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Tồn kho</th>
                  <th>Điểm đặt hàng</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {lowStockProducts.map((p) => (
                  <tr key={p._id} className="hover">
                    <td>
                      <p className="font-bold">{p.name}</p>
                      <div className="flex gap-2 mt-1">
                        {Object.entries(p.sizes).map(([size, stock]) => (
                          <span
                            key={size}
                            className="badge badge-ghost badge-sm"
                          >
                            {size}: {stock}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>{p.totalStock}</td>
                    <td>{p.reorderPoint}</td>
                    <td>
                      <button
                        onClick={() => openModal(p)}
                        className="btn btn-sm btn-primary"
                      >
                        <Plus size={16} /> Nhập kho
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header flex justify-between items-center">
          <h3 className="text-lg font-semibold text-black">Tất cả sản phẩm</h3>
          <div className="w-1/3">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>
        </div>
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Ảnh</th>
                  <th>Tên</th>
                  <th>Danh mục</th>
                  <th>Tổng tồn kho</th>
                  <th>Giá trị kho</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p._id} className="hover">
                    <td>
                      <img
                        src={p.image[0]}
                        alt={p.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </td>
                    <td>
                      <p className="font-bold">{p.name}</p>
                      <div className="flex gap-2 mt-1">
                        {Object.entries(p.sizes).map(([size, stock]) => (
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
                    <td>{p.category}</td>
                    <td>{p.totalStock}</td>
                    <td>{(p.totalStock * p.price).toLocaleString("vi-VN")}đ</td>
                    <td className="flex flex-col gap-2">
                      <button
                        onClick={() => openModal(p)}
                        className="btn btn-xs btn-primary"
                      >
                        <Plus size={14} /> Nhập kho
                      </button>
                      <button
                        onClick={() => viewHistory(p)}
                        className="btn btn-xs btn-ghost"
                      >
                        Lịch sử
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {historyModal.isOpen && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-4xl">
            <button
              onClick={() =>
                setHistoryModal({ isOpen: false, productName: "", history: [] })
              }
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
            <h3 className="font-bold text-lg mb-4">
              Lịch sử kho: {historyModal.productName}
            </h3>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Ngày</th>
                    <th>Loại</th>
                    <th>Size</th>
                    <th>Số lượng</th>
                    <th>Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {historyModal.history
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((item, index) => (
                      <tr key={index}>
                        <td>{new Date(item.date).toLocaleString("vi-VN")}</td>
                        <td>
                          <span
                            className={`badge ${
                              item.type === "in"
                                ? "badge-success"
                                : "badge-warning"
                            }`}
                          >
                            {item.type === "in" ? "Nhập" : "Xuất"}
                          </span>
                        </td>
                        <td>{item.size}</td>
                        <td>{item.quantity}</td>
                        <td>{item.note}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {modal.isOpen && (
        <div className="modal modal-open">
          <div className="modal-box relative">
            <button
              onClick={() => setModal({ isOpen: false, product: null })}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
            <h3 className="font-bold text-lg mb-4">
              Nhập kho: {modal.product.name}
            </h3>
            <form onSubmit={handleRestock} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Size</span>
                </label>
                <select
                  value={restockData.size}
                  onChange={(e) =>
                    setRestockData({ ...restockData, size: e.target.value })
                  }
                  className="select select-bordered w-full"
                >
                  {Object.keys(modal.product.sizes).map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Số lượng</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={restockData.quantity}
                  onChange={(e) =>
                    setRestockData({
                      ...restockData,
                      quantity: Number(e.target.value),
                    })
                  }
                  className="input input-bordered w-full"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Ghi chú</span>
                </label>
                <input
                  type="text"
                  value={restockData.note}
                  onChange={(e) =>
                    setRestockData({ ...restockData, note: e.target.value })
                  }
                  placeholder="VD: Nhập từ nhà cung cấp A"
                  className="input input-bordered w-full"
                />
              </div>
              <div className="modal-action">
                <button
                  type="button"
                  onClick={() => setModal({ isOpen: false, product: null })}
                  className="btn btn-ghost"
                >
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  Xác nhận
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, title, value }) => (
  <div className="card bg-base-100 shadow-sm">
    <div className="card-body flex-row items-center gap-4">
      <div className="p-3 bg-base-200 rounded-lg">{icon}</div>
      <div>
        <p className="text-gray-600 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-black">{value}</p>
      </div>
    </div>
  </div>
);

export default Inventory;
