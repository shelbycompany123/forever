import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";
import { Category, Subcategory } from "../models/categoryModel.js";
// Add products
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      selling_price,
      original_price,
      promo_price,
      promo_start,
      promo_end,
      category,
      subCategory,
      sizes,
    } = req.body;

    // Xử lý ảnh từ mảng files
    const images = req.files || [];

    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    let parsedSizes = {};
    if (sizes) {
      try {
        const tempSizes = typeof sizes === "string" ? JSON.parse(sizes) : sizes;
        // Chuyển đổi thành Map để lưu
        parsedSizes = new Map(Object.entries(tempSizes));
      } catch (e) {
        return res.json({
          success: false,
          message: "Định dạng sizes không hợp lệ",
        });
      }
    }

    const productData = {
      name,
      description,
      category,
      selling_price: Number(selling_price),
      original_price: Number(original_price),
      promo_price: promo_price ? Number(promo_price) : null,
      promo_start: promo_start ? new Date(promo_start) : null,
      promo_end: promo_end ? new Date(promo_end) : null,
      subCategory,
      sizes: parsedSizes,
      image: imagesUrl,
      date: Date.now(),
    };

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Product Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get list products
const listProducts = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category", "name")
      .populate("subCategory", "name");
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Remove Products
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product remove" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get single products
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Lấy sản phẩm
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);
    if (!product) {
      res.json({ success: false, message: "Không tìm thấy sản phẩm" });
    } else {
      res.json({
        success: true,
        message: "Lấy sản phẩm thành công",
        data: product,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Cập nhật sản phẩm
const updateProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);

    if (!product) {
      return res.json({ success: false, message: "Sản phẩm không tồn tại" });
    }

    const {
      name,
      description,
      selling_price,
      original_price,
      promo_price,
      promo_start,
      promo_end,
      category,
      subCategory,
      sizes,
    } = req.body;

    // Xử lý ảnh - kiểm tra xem có ảnh mới được upload không
    let updatedImageUrls = [...product.image]; // Giữ ảnh cũ làm mặc định

    // Kiểm tra nếu có thông tin về số lượng ảnh hiện tại từ frontend
    if (req.body.currentImageCount) {
      const currentCount = parseInt(req.body.currentImageCount);
      // Nếu số ảnh hiện tại ít hơn số ảnh ban đầu, cắt bớt mảng
      if (currentCount < updatedImageUrls.length) {
        updatedImageUrls = updatedImageUrls.slice(0, currentCount);
      }
    }

    if (req.files && req.files.length > 0) {
      // Upload tất cả ảnh mới lên Cloudinary
      const newImageUrls = await Promise.all(
        req.files.map(async (file) => {
          try {
            let result = await cloudinary.uploader.upload(file.path, {
              resource_type: "image",
            });
            return result.secure_url;
          } catch (uploadError) {
            console.log("Error uploading image:", uploadError);
            return null;
          }
        })
      );

      // Lọc bỏ các ảnh upload thất bại
      const validNewImages = newImageUrls.filter((url) => url !== null);

      // Thêm ảnh mới vào cuối mảng ảnh hiện tại
      if (validNewImages.length > 0) {
        updatedImageUrls = [...updatedImageUrls, ...validNewImages];
      }
    }

    // Cập nhật thông tin sản phẩm
    product.name = name || product.name;
    product.description = description || product.description;
    product.selling_price = selling_price
      ? Number(selling_price)
      : product.selling_price;
    product.original_price = original_price
      ? Number(original_price)
      : product.original_price;
    product.promo_price = promo_price ? Number(promo_price) : null;
    product.promo_start = promo_start ? new Date(promo_start) : null;
    product.promo_end = promo_end ? new Date(promo_end) : null;
    product.category = category || product.category;
    product.subCategory = subCategory || product.subCategory;
    if (sizes) {
      try {
        const tempSizes = typeof sizes === "string" ? JSON.parse(sizes) : sizes;
        product.sizes = new Map(Object.entries(tempSizes));
      } catch (e) {
        // Bỏ qua nếu parse lỗi, giữ lại giá trị cũ
      }
    }
    product.image = updatedImageUrls;

    await product.save();
    res.json({ success: true, message: "Cập nhật sản phẩm thành công" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Lỗi khi cập nhật sản phẩm" });
  }
};

const filterProducts = async (req, res) => {
  try {
    const { category, subCategory, sort, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};
    let hasValidCategory = true;
    let hasValidSubCategory = true;

    if (category) {
      const slugArray = Array.isArray(category)
        ? category
        : category.split(",");
      const categories = await Category.find({ slug: { $in: slugArray } });
      if (categories.length === slugArray.length) {
        filter.category = { $in: categories.map((cat) => cat._id) };
      } else {
        hasValidCategory = false;
      }
    }

    if (subCategory) {
      const slugArray = Array.isArray(subCategory)
        ? subCategory
        : subCategory.split(",");
      const subCategories = await Subcategory.find({
        slug: { $in: slugArray },
      });
      if (subCategories.length === slugArray.length) {
        filter.subCategory = { $in: subCategories.map((cat) => cat._id) };
      } else {
        hasValidSubCategory = false;
      }
    }

    console.log(hasValidCategory, hasValidSubCategory);
    if (
      (category && !hasValidCategory) ||
      (subCategory && !hasValidSubCategory)
    ) {
      return res.json({
        success: true,
        products: [],
        pagination: {
          total: 0,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: 0,
        },
      });
    }

    const products = await productModel
      .find(filter)
      .sort({
        selling_price: sort === "asc" ? 1 : -1,
      })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("category", "name slug")
      .populate("subCategory", "name slug");

    const total = await productModel.countDocuments(filter);

    res.json({
      success: true,
      products,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Lỗi khi lọc sản phẩm" });
  }
};

export {
  addProduct,
  listProducts,
  removeProduct,
  singleProduct,
  getProduct,
  updateProduct,
  filterProducts,
};
