import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import ratingModel from "../models/RattingModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Route for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User doesn't exists" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = createToken(user._id);
      res.json({ success: true, token, userId: user._id });
    } else {
      res.json({ success: false, message: "Mật khẩu không chính xác" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for user register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Checking user already exists or not
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    // Validating email format & strong password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    // Hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();

    const token = createToken(user._id);

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get List User
const listUser = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.json({ success: true, message: "Lấy người dùng thành công", users });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Lỗi lấy người dùng" });
  }
};

// Get User Profile
const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id).select("-password");
    if (!user) {
      return res.json({ success: false, message: "Không tìm thấy người dùng" });
    }
    res.json({
      success: true,
      message: "Lấy thông tin người dùng thành công",
      user,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Lỗi lấy thông tin người dùng" });
  }
};

// Update User Info
const updateUserInfo = async (req, res) => {
  try {
    let userId;

    // Nếu có userId trong body (từ user), sử dụng nó
    if (req.body.userId) {
      userId = req.body.userId;
    } else {
      return res.json({ success: false, message: "Thiếu ID người dùng" });
    }

    const { name, phone, address } = req.body;

    // Chỉ cho phép update các trường name, phone, address
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { name, phone, address },
      { new: true, runValidators: true, fields: { password: 0, email: 0 } }
    );

    if (!updatedUser) {
      return res.json({ success: false, message: "Không tìm thấy người dùng" });
    }

    res.json({
      success: true,
      message: "Cập nhật thông tin thành công",
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Lỗi cập nhật thông tin người dùng" });
  }
};

// Get User Orders
const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await orderModel.find({ userId }).sort({ date: -1 });
    res.json({
      success: true,
      message: "Lấy đơn hàng thành công",
      orders,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Lỗi lấy đơn hàng" });
  }
};

// Get User Ratings
const getUserRatings = async (req, res) => {
  try {
    const { userId } = req.params;
    const ratings = await ratingModel.find({ userId }).sort({ date: -1 });
    res.json({
      success: true,
      message: "Lấy đánh giá thành công",
      ratings,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Lỗi lấy đánh giá" });
  }
};

export {
  loginUser,
  registerUser,
  adminLogin,
  listUser,
  getUserProfile,
  updateUserInfo,
  getUserOrders,
  getUserRatings,
};
