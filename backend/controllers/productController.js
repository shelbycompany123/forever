import {v2 as cloudinary} from "cloudinary";
import productModel from "../models/productModel.js";

// Add products
const addProduct = async (req, res) => {
    try {
        const {name, description, new_price, old_price, category, subCategory, sizes, bestseller, sale} = req.body;

        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        const imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, {resource_type: 'image'});
                return result.secure_url
            })
        )

        let parsedSizes;
        try {
            parsedSizes = typeof sizes === "string" ? JSON.parse(sizes) : sizes;

            const defaultSizes = ["S", "M", "L", "XL", "XXL"];
            for (let size of defaultSizes) {
                if (parsedSizes[size] === undefined || isNaN(parsedSizes[size])) {
                    parsedSizes[size] = 0;
                }
            }
        } catch (e) {
            return res.json({ success: false, message: "Định dạng sizes không hợp lệ" });
        }

        const productData = {
            name,
            description,
            category,
            new_price: Number(new_price),
            old_price: Number(old_price),
            subCategory,
            bestseller: bestseller ? true : false,
            // sizes: JSON.parse(sizes),
            sizes: parsedSizes,
            sale: sale === "true" ? true : false, // New add
            image: imagesUrl,
            date: Date.now()
        }

        console.log(productData);

        const product = new productModel(productData);
        await product.save()

        res.json({success: true, message: "Product Added"})
    
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

// Get list products
const listProducts = async (req, res) => {
    try {
        const products = await productModel.find({}).populate('category', 'name').populate('subCategory', 'name');
        res.json({success: true, products})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

// Remove Products
const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id)
        res.json({success: true, message: "Product remove"})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

// Get single products
const singleProduct = async (req, res) => {
    try {
        const {productId} = req.body;
        const product = await productModel.findById(productId)
        res.json({success: true, product})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

// Lấy sản phẩm 
const getProduct = async (req, res) => {
    try {
        const {id} = req.params;
        const product = await productModel.findById(id)
        if (!product) {
            res.json({success: false, message: "Không tìm thấy sản phẩm"})
        } 
        else {
            res.json({success: true, message: "Lấy sản phẩm thành công", data: product})
        }
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error"})
    }
}

// Cập nhật sản phẩm
const updateProduct = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id);

        if (!product) {
            return res.json({success: false, message: "Sản phẩm không tồn tại"})
        }

        const {name, description, new_price, old_price, category, subCategory, sizes, bestseller, sale} = req.body;

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

        if (req.files) {
            const image1 = req.files.image1 && req.files.image1[0]
            const image2 = req.files.image2 && req.files.image2[0]
            const image3 = req.files.image3 && req.files.image3[0]
            const image4 = req.files.image4 && req.files.image4[0]

            const newImages = [image1, image2, image3, image4];

            // Upload ảnh mới lên Cloudinary và cập nhật vào mảng
            for (let i = 0; i < newImages.length; i++) {
                if (newImages[i]) {
                    try {
                        let result = await cloudinary.uploader.upload(newImages[i].path, {resource_type: 'image'});
                        // Nếu đây là ảnh thêm mới (index >= độ dài mảng hiện tại)
                        if (i >= updatedImageUrls.length) {
                            updatedImageUrls.push(result.secure_url);
                        } else {
                            updatedImageUrls[i] = result.secure_url;
                        }
                    } catch (uploadError) {
                        console.log(`Error uploading image ${i + 1}:`, uploadError);
                    }
                }
            }
        }

        // Cập nhật thông tin sản phẩm
        product.name = name || product.name;
        product.description = description || product.description;
        product.new_price = new_price ? Number(new_price) : product.new_price;
        product.old_price = old_price ? Number(old_price) : product.old_price;
        product.category = category || product.category;
        product.subCategory = subCategory || product.subCategory;
        product.bestseller = bestseller !== undefined ? (bestseller === "true" ? true : false) : product.bestseller;
        product.sizes = sizes ? JSON.parse(sizes) : product.sizes;
        product.sale = sale !== undefined ? (sale === "true" ? true : false) : product.sale; // New add
        product.image = updatedImageUrls;

        await product.save();
        res.json({success: true, message: "Cập nhật sản phẩm thành công"})

    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Lỗi khi cập nhật sản phẩm"})
    }
}

const getSaleProducts = async (req, res) => {
    try {
        const saleProducts = await productModel.find({sale: true});
        res.json({success: true, products: saleProducts});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Lỗi khi lấy sản phẩm sale"})
    }
}

export {addProduct, listProducts, removeProduct, singleProduct, getProduct, updateProduct, getSaleProducts};