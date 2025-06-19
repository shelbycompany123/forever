import express from "express"
import {addCategory, addSubcategory, listCategories, listSubcategories, deleteCategory, deleteSubcategory} from "../controllers/categoryController.js"

const categoryRouter = express.Router()

categoryRouter.post('/addcategory', addCategory)
categoryRouter.post('/addsubcategory', addSubcategory)
categoryRouter.get('/listcategories', listCategories)
categoryRouter.get('/listsubcategories', listSubcategories)
categoryRouter.post('/deletecategory/:id', deleteCategory)
categoryRouter.post('/deletesubcategory/:id', deleteSubcategory)

export default categoryRouter;
