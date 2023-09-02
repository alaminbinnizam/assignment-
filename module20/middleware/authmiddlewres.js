import JWT from 'jsonwebtoken';
import User from '../models/User.js';

//Protected Routes token base
export const requireSignIn = async (req, res, next) => {
    try {
      const decode = JWT.verify(
        req.headers.authorization,
        process.env.JWT_SECRET
      );
      req.user = decode;
      next();
    } catch (error) {
      console.log(error);
    }
  };

  //admin acceess
  export const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (user.role !== 1) {
            return res.status(401).send({
                success: false,
                message: 'Unauthorized Access'
            })
        } else {
            next();
        }
    } catch (error) {
        console.log(error);
        res.status(401).send({
            success: false,
            message: 'Error in Admin Middleware',
            error
        })
    }
}

//shopowner access
export const isShopOwner = async (req, res, next) => {
  try {
      const user = await User.findById(req.user._id);
      if (user.role !== 2) {
          return res.status(401).send({
              success: false,
              message: 'Unauthorized Access'
          })
      } else {
          next();
      }
  } catch (error) {
      console.log(error);
      res.status(401).send({
          success: false,
          message: 'Error in Shop Owner Middleware',
          error
      })
  }
}