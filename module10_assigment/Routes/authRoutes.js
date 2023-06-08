import express from "express";
import {
    registerController,
    loginController,
} from '../Controllers/authController.js';

//router object
const router = express.Router()

//routing
//register || post
router.post('/register', registerController);

//login || post
router.post('/login', loginController);


export default router;