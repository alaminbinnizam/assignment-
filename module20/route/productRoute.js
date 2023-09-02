import express from "express";
import {
    createProductController,
    deleteProductController,
    getProductController,
    getSingleProductController,
    productCategoryController,
    productPhotoController,
    searchProductController,
    updateProductController,

} from "../controllers/productController.js";
import ExpressFormidable from "express-formidable";
import { isShopOwner, requireSignIn } from "../middlewres/authMiddlewares.js";

const router = express.Router();

//routes
//create route
router.post('/create-product', requireSignIn, isShopOwner, ExpressFormidable(), createProductController);

// updating route
router.put('/update-product/:pid', requireSignIn, isShopOwner, ExpressFormidable(), updateProductController);


// get Product
router.get('/getall-product', getProductController);

//single product
router.get('/getsingle-product/:pid', getSingleProductController);

//get photo
router.get('/product-photo/:pid', productPhotoController);

// //delete product
router.delete('/delete-product/:pid', requireSignIn, isShopOwner, deleteProductController);

// //flter product
// router.post('/product-filters', productFilterController);

// //product count
// router.get('/product-count', productCountController);

// //product per page
// router.get('/product-list/:page', productListController);

//search product
router.get('/search/:keyword', searchProductController);

// //simillar product
// router.get('/related-product/:pid/:cid', relatedProductController);

//category wise product
router.get('/product-category/:slug', productCategoryController)



export default router