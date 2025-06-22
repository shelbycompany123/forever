import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import productModel from "../models/productModel.js";
// Gateway
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Placing order using COD method
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
      status: "chua_xac_nhan",
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const orderDetails = await orderModel.findById(newOrder._id);

    for (let i = 0; i < orderDetails.items.length; i++) {
      await productModel.findByIdAndUpdate(orderDetails.items[i]._id, {
        $inc: { [`sizes.${orderDetails.items[i].size}`]: -1 },
      });
    }
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Placing order using Stripe method
const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const { origin } = req.headers;
    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const line_items = items.map((item) => ({
      price_data: {
        currency: "vnd",
        product_data: {
          name: item.name,
        },
        unit_amount: item.new_price,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "vnd",
        product_data: {
          name: "Phí giao hàng",
        },
        unit_amount: 20000,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Verify Stripe
const verifyStripe = async (req, res) => {
  const { orderId, success, userId } = req.body;

  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      res.json({ success: true });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Placing order using Stripe method
const placeOrderRazorpay = async (req, res) => {};

// All Orders data for Admin Controller
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// User Order Data for Frontend
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;

    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update order status from Admin Panel
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const orderDetails = await orderModel.findById(orderId);

    if (status === "da_giao") {
      await orderModel.findByIdAndUpdate(orderId, {
        status,
        payment: true,
        date: Date.now(),
      });
      res.json({ success: true, message: "Status Updated" });
    } else if (status === "da_huy") {
      await orderModel.findByIdAndUpdate(orderId, {
        status,
        payment: false,
        date: Date.now(),
      });
      for (let i = 0; i < orderDetails.items.length; i++) {
        await productModel.findByIdAndUpdate(orderDetails.items[i]._id, {
          $inc: { [`sizes.${orderDetails.items[i].size}`]: 1 },
        });
      }
      res.json({ success: true, message: "Status Updated" });
    } else {
      await orderModel.findByIdAndUpdate(orderId, { status, date: Date.now() });
      res.json({ success: true, message: "Status Updated" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get order details by ID for Admin Panel
const getOrderDetail = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.json({ success: false, message: "Không tìm thấy đơn hàng" });
    }

    res.json({ success: true, order });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
  verifyStripe,
  getOrderDetail,
};
