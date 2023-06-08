import express from "express";
import {
    createProductController,
    getProductController,
} from "../Controllers/productController.js";
import { requireSignIn } from "../Middlewares/authMiddleware.js";

const router = express.Router();

//routes
//create route
router.post('/create-product', requireSignIn, createProductController);

// get Product
router.get('/get-product', getProductController);






export default router