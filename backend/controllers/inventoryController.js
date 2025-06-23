import productModel from "../models/productModel.js";

// Lấy danh sách sản phẩm hết hàng hoặc sắp hết hàng
const getLowStockProducts = async (req, res) => {
  try {
    const products = await productModel.find();

    const lowStockProducts = products.filter((product) => {
      const totalStock = Object.values(product.sizes).reduce(
        (sum, stock) => sum + stock,
        0
      );
      return totalStock <= product.reorderPoint;
    });

    res.json({
      success: true,
      lowStockProducts: lowStockProducts.map((product) => ({
        _id: product._id,
        name: product.name,
        sizes: product.sizes,
        totalStock: Object.values(product.sizes).reduce(
          (sum, stock) => sum + stock,
          0
        ),
        reorderPoint: product.reorderPoint,
      })),
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Nhập kho
const restockProduct = async (req, res) => {
  try {
    const { productId, size, quantity, note } = req.body;

    const product = await productModel.findById(productId);
    if (!product) {
      return res.json({ success: false, message: "Sản phẩm không tồn tại" });
    }

    product.sizes[size] = (product.sizes[size] || 0) + quantity;

    product.stockHistory.push({
      type: "in",
      quantity: quantity,
      size: size,
      note: note || "Nhập kho",
    });

    await product.save();

    res.json({
      success: true,
      message: "Nhập kho thành công",
      updatedStock: product.sizes,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Thống kê kho hàng
const getInventoryStats = async (req, res) => {
  try {
    const products = await productModel.find();

    let totalProducts = products.length;
    let totalStock = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    products.forEach((product) => {
      const productStock = Object.values(product.sizes).reduce(
        (sum, stock) => sum + stock,
        0
      );
      totalStock += productStock;

      if (productStock <= product.reorderPoint) {
        lowStockCount++;
      }

      if (productStock === 0) {
        outOfStockCount++;
      }
    });

    res.json({
      success: true,
      stats: {
        totalProducts,
        totalStock,
        lowStockCount,
        outOfStockCount,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const getInventoryProducts = async (req, res) => {
  try {
    const products = await productModel.find({});

    const inventoryProducts = products.map((product) => {
      const totalStock = Object.values(product.sizes).reduce(
        (sum, stock) => sum + stock,
        0
      );
      return {
        _id: product._id,
        name: product.name,
        image: product.image,
        category: product.category,
        new_price: product.new_price,
        sizes: product.sizes,
        totalStock,
      };
    });

    res.json({ success: true, data: inventoryProducts });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Lỗi khi tải dữ liệu sản phẩm kho" });
  }
};

const getProductHistory = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await productModel
      .findById(productId)
      .select("stockHistory");
    if (!product) {
      return res.json({ success: false, message: "Không tìm thấy sản phẩm" });
    }
    res.json({ success: true, data: product.stockHistory });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Lỗi khi tải lịch sử sản phẩm" });
  }
};

export {
  getProductHistory,
  getInventoryProducts,
  getLowStockProducts,
  restockProduct,
  getInventoryStats,
};
