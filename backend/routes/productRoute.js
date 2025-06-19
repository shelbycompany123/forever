import express from "express"
import {addProduct, listProducts, removeProduct, singleProduct, getProduct, updateProduct, getSaleProducts} from "../controllers/productController.js"
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const productRouter = express.Router();

productRouter.post('/add', upload.fields([{name: 'image1', maxCount: 1}, {name: 'image2', maxCount: 1}, {name: 'image3', maxCount: 1}, {name: 'image4', maxCount: 1}]), addProduct);
productRouter.post('/remove', adminAuth, removeProduct);
productRouter.post('/single', singleProduct);
productRouter.get('/list', listProducts);
productRouter.get('/get/:id', getProduct);
productRouter.put('/update/:id', adminAuth, upload.fields([{name: 'image1', maxCount: 1}, {name: 'image2', maxCount: 1}, {name: 'image3', maxCount: 1}, {name: 'image4', maxCount: 1}]), updateProduct);
productRouter.get('/sale', getSaleProducts);

export default productRouter;