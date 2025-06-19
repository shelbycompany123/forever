import orderModel from '../models/orderModel.js'
import userModel from '../models/userModel.js'

const getRevenue = async (req, res) => {
    try {
        const orders = await orderModel.find();

        // Tính tổng doanh thu dựa trên field amount
        const totalRevenue = orders.reduce((sum, order) => sum + Number(order.amount || 0), 0);

        res.json({ success: true, totalRevenue });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const getTotalUsers = async (req, res) => {
    try {
        const totalUsers = await userModel.countDocuments();
        res.json({success: true, totalUsers})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

const getTotalOrders = async (req, res) => {
    try {
        const totalOrders = await orderModel.countDocuments();
        res.json({success: true, totalOrders})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

export {getRevenue, getTotalUsers, getTotalOrders}; 