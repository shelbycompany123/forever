import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";

const getRevenue = async (req, res) => {
  try {
    const orders = await orderModel.find({ status: "da_giao" });

    const totalRevenue = orders.reduce(
      (sum, order) => sum + Number(order.amount || 0),
      0
    );

    res.json({ success: true, totalRevenue });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const getTotalUsers = async (req, res) => {
  try {
    const totalUsers = await userModel.countDocuments();
    res.json({ success: true, totalUsers });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const getTotalOrders = async (req, res) => {
  try {
    const totalOrders = await orderModel.countDocuments();
    res.json({ success: true, totalOrders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const getTopSellingProducts = async (req, res) => {
  try {
    // Lấy tất cả đơn hàng đã giao
    const deliveredOrders = await orderModel.find({ status: "da_giao" });

    // Tạo object để đếm số lượng bán của từng sản phẩm
    const productSales = {};

    deliveredOrders.forEach((order) => {
      order.items.forEach((item) => {
        const productId = item._id;
        if (productSales[productId]) {
          productSales[productId] += item.quantity || 1;
        } else {
          productSales[productId] = item.quantity || 1;
        }
      });
    });

    // Chuyển đổi thành array và sắp xếp theo số lượng bán giảm dần
    const sortedProducts = Object.entries(productSales)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10); // Lấy top 10 sản phẩm

    // Lấy thông tin chi tiết của các sản phẩm
    const topProducts = await Promise.all(
      sortedProducts.map(async ([productId, soldQuantity]) => {
        const product = await productModel.findById(productId);
        if (product) {
          return {
            _id: product._id,
            name: product.name,
            new_price: product.new_price,
            old_price: product.old_price,
            image: product.image[0], // Lấy ảnh đầu tiên
            soldQuantity: soldQuantity,
            category: product.category,
            subCategory: product.subCategory,
            bestseller: product.bestseller,
            sale: product.sale,
          };
        }
        return null;
      })
    );

    // Lọc bỏ các sản phẩm null (nếu có)
    const validProducts = topProducts.filter((product) => product !== null);

    res.json({
      success: true,
      topSellingProducts: validProducts,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const getRevenueStats = async (req, res) => {
  try {
    const today = new Date();
    const thirtyDaysAgo = new Date(new Date().setDate(today.getDate() - 30));

    // Lấy các đơn hàng đã giao trong 30 ngày qua
    const orders = await orderModel.find({
      status: "da_giao",
      date: { $gte: thirtyDaysAgo.getTime() },
    });

    // Nhóm doanh thu theo ngày
    const dailyRevenue = orders.reduce((acc, order) => {
      const orderDate = new Date(order.date).toISOString().split("T")[0]; // Format YYYY-MM-DD
      acc[orderDate] = (acc[orderDate] || 0) + order.amount;
      return acc;
    }, {});

    // Tạo mảng dữ liệu cho 30 ngày, điền 0 cho những ngày không có doanh thu
    const revenueData = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(new Date().setDate(today.getDate() - i));
      const formattedDate = date.toISOString().split("T")[0];
      revenueData.unshift({
        date: formattedDate,
        revenue: dailyRevenue[formattedDate] || 0,
      });
    }

    res.json({ success: true, revenueData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  getRevenue,
  getTotalUsers,
  getTotalOrders,
  getTopSellingProducts,
  getRevenueStats,
};
