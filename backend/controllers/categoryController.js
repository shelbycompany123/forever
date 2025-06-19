import { Category, Subcategory } from "../models/categoryModel.js";

// Add category
const addCategory = async (req, res) => {
    try {
        const {name} = req.body;
        const category = new Category({name});
        await category.save();
        res.json({success: true, message: "Category added"})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

// Add subcategory
const addSubcategory = async (req, res) => {
    try {
        const {name} = req.body;
        const subcategory = new Subcategory({name});
        await subcategory.save();
        res.json({success: true, message: "Subcategory added"})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

// List categories
const listCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.json({success: true, categories})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

// List subcategories
const listSubcategories = async (req, res) => {
    try {
        const subcategories = await Subcategory.find({});
        res.json({success: true, subcategories})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

// Delete category
const deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        await Category.findByIdAndDelete(categoryId);
        res.json({success: true, message: "Xóa danh mục thành công"})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

// Delete Subcategory
const deleteSubcategory = async (req, res) => {
    try {
        const subcategoryId = req.params.id;
        await Subcategory.findByIdAndDelete(subcategoryId);
        res.json({success: true, message: "Xóa danh mục con thành công"})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

export {addCategory, addSubcategory, listCategories, listSubcategories, deleteCategory, deleteSubcategory};


