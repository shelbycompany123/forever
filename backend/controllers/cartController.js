import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";

// Add products to user cart
const addToCart = async (req, res) => {
    try {
      const {userId, itemId, size, quantity} = req.body
      const productData = await productModel.findById(itemId)
      if (productData.sizes[size] === 0) {
        return res.json({success: false, message: "Sản phẩm đã hết hàng"})
      } else if(quantity > productData.sizes[size]){
        return res.json({success: false, message: "Vượt quá số lượng sản phẩm"})
      }
        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData;

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1
            }
            else {
                cartData[itemId][size] = 1
            }
        } else {
            cartData[itemId] = {}
            cartData[itemId][size] = 1
        }

        await userModel.findByIdAndUpdate(userId, {cartData})

        res.json({ success: true, message: "Thêm vào giỏ hàng thành công"})

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

// Update user cart
const updateCart = async (req, res) => {
    try {
        const {userId, itemId, size, quantity} = req.body;
        const productData = await productModel.findById(itemId)
        if (productData.sizes[size] === 0) {
            return res.json({success: false, message: "Sản phẩm đã hết hàng"})
        } else if(quantity > productData.sizes[size]){
            return res.json({success: false, message: "Vượt quá số lượng sản phẩm"})
        }
        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData;

        cartData[itemId][size] = quantity

        await userModel.findByIdAndUpdate(userId, {cartData})
        res.json({success: true, message: "Cart Updated",quantity: Math.min(quantity, productData.sizes[size])})


    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

// Get user cart data
const getUserCart = async (req, res) => {
    try {
        const {userId} = req.body;

        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData;

        res.json({success: true, cartData})

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

export {addToCart, updateCart, getUserCart}