import { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { Plus, Trash2, Edit, Save, X, FolderOpen, Folder } from "lucide-react";
import { toast } from "react-hot-toast";

const AddCategories = ({ token }) => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newSubCategory, setNewSubCategory] = useState("");
  const [editMode, setEditMode] = useState({ type: "", id: null, name: "" });
  const [loading, setLoading] = useState(false);

  // Fetch categories and subcategories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${backendUrl}/api/category/listcategories`
      );
      if (response.data.success) {
        setCategories(response.data.categories);
      } else {
        toast.error(response.data.message || "Không thể tải danh mục");
      }
      setLoading(false);
    } catch (error) {
      toast.error("Không thể tải danh mục");
      setLoading(false);
    }
  };

  const fetchSubCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${backendUrl}/api/category/listsubcategories`
      );
      if (response.data.success) {
        setSubCategories(response.data.subcategories);
      } else {
        toast.error(response.data.message || "Không thể tải danh mục con");
      }
      setLoading(false);
    } catch (error) {
      toast.error("Không thể tải danh mục con");
      setLoading(false);
    }
  };

  // Add new category
  const addCategory = async () => {
    if (!newCategory.trim()) {
      toast.error("Tên danh mục không được để trống");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${backendUrl}/api/category/addcategory`,
        { name: newCategory },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        fetchCategories(); // Refresh the list
        setNewCategory("");
        toast.success("Thêm danh mục thành công");
      } else {
        toast.error(response.data.message || "Không thể thêm danh mục");
      }
      setLoading(false);
    } catch (error) {
      toast.error("Không thể thêm danh mục");
      setLoading(false);
    }
  };

  // Add new subcategory
  const addSubCategory = async () => {
    if (!newSubCategory.trim()) {
      toast.error("Tên danh mục con không được để trống");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${backendUrl}/api/category/addsubcategory`,
        { name: newSubCategory },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        fetchSubCategories(); // Refresh the list
        setNewSubCategory("");
        toast.success("Thêm danh mục con thành công");
      } else {
        toast.error(response.data.message || "Không thể thêm danh mục con");
      }
      setLoading(false);
    } catch (error) {
      toast.error("Không thể thêm danh mục con");
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      try {
        const response = await axios.post(
          backendUrl + `/api/category/deletecategory/${id}`
        );
        if (response.data.success) {
          toast.success(response.data.message);
          await fetchCategories();
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const deleteSubCategory = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục con này?")) {
      try {
        const response = await axios.post(
          backendUrl + `/api/category/deletesubcategory/${id}`
        );
        if (response.data.success) {
          toast.success(response.data.message);
          await fetchSubCategories();
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  if (loading && categories.length === 0 && subCategories.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="card-body">
          <h1 className="text-3xl font-bold text-black mb-2">
            Quản lý danh mục sản phẩm
          </h1>
          <p className="text-gray-600">
            Thêm, chỉnh sửa và xóa các danh mục sản phẩm
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categories Section */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-black flex items-center gap-2">
              <FolderOpen size={20} />
              Danh mục chính
            </h2>
          </div>
          <div className="card-body">
            {/* Add new category */}
            <div className="flex mb-6">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Tên danh mục mới"
                className="form-input rounded-r-none"
                onKeyPress={(e) => e.key === "Enter" && addCategory()}
              />
              <button
                onClick={addCategory}
                disabled={loading}
                className="btn-primary rounded-l-none px-4 py-2 flex items-center disabled:opacity-50"
              >
                <Plus size={18} className="mr-1" /> Thêm
              </button>
            </div>

            {/* Categories list */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              {categories.length === 0 ? (
                <div className="text-center py-8">
                  <Folder className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="text-gray-500 mt-2">Chưa có danh mục nào</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {categories.map((category) => (
                    <li
                      key={category._id}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center gap-3">
                        <Folder size={16} className="text-gray-400" />
                        <span className="font-medium text-black">
                          {category.name}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => deleteCategory(category._id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa danh mục"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* SubCategories Section */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-black flex items-center gap-2">
              <Folder size={20} />
              Danh mục con
            </h2>
          </div>
          <div className="card-body">
            {/* Add new subcategory */}
            <div className="flex mb-6">
              <input
                type="text"
                value={newSubCategory}
                onChange={(e) => setNewSubCategory(e.target.value)}
                placeholder="Tên danh mục con mới"
                className="form-input rounded-r-none"
                onKeyPress={(e) => e.key === "Enter" && addSubCategory()}
              />
              <button
                onClick={addSubCategory}
                disabled={loading}
                className="btn-primary rounded-l-none px-4 py-2 flex items-center disabled:opacity-50"
              >
                <Plus size={18} className="mr-1" /> Thêm
              </button>
            </div>

            {/* SubCategories list */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              {subCategories.length === 0 ? (
                <div className="text-center py-8">
                  <Folder className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="text-gray-500 mt-2">Chưa có danh mục con nào</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {subCategories.map((subCategory) => (
                    <li
                      key={subCategory._id}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center gap-3">
                        <Folder size={16} className="text-gray-400" />
                        <span className="font-medium text-black">
                          {subCategory.name}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => deleteSubCategory(subCategory._id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa danh mục con"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="card">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <FolderOpen size={20} className="text-black" />
                <div>
                  <p className="text-sm text-gray-600">Tổng danh mục chính</p>
                  <p className="text-2xl font-bold text-black">
                    {categories.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <Folder size={20} className="text-black" />
                <div>
                  <p className="text-sm text-gray-600">Tổng danh mục con</p>
                  <p className="text-2xl font-bold text-black">
                    {subCategories.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategories;
