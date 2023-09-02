import fs from 'fs';
import slugify from "slugify";
import dotenv from 'dotenv'
import ProductModel from '../models/ProductModel.js';
import CategoryModel from '../models/CategoryModel.js'
import User from '../models/User.js';
dotenv.config()

export const createProductController = async (req, res) => {
    try {
        const { name, slug, description, price, category, quantity } = req.fields;
        const { photo } = req.files;
        //validation
        switch (true) {
            case !name:
                return res.status(500).send({ error: 'Name is required' });

            case !description:
                return res.status(500).send({ error: 'Description is required' });

            case !price:
                return res.status(500).send({ error: 'Price is required' });

            case !category:
                return res.status(500).send({ error: 'Category is required' });

            case !quantity:
                return res.status(500).send({ error: 'Quantity is required' });

            case !photo && photo.size > 1000000:
                return res.status(500).send({ error: 'Photo is  and should be less then 1 megabyte' });
        }

        const products = new ProductModel({ ...req.fields, slug: slugify(name), user: req.user._id });
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }

        await products.save();
        await User.updateOne({
            _id: req.user._id
        }, {
            $push: {
                product: products._id
            }
        })

        res.status(201).send({
            success: true,
            message: 'Product Created Successfully',
            products
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in creating product',
            error
        })
    }
}

export const updateProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity } =
            req.fields;
        const { photo } = req.files;
        //alidation
        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is Required" });
            case !description:
                return res.status(500).send({ error: "Description is Required" });
            case !price:
                return res.status(500).send({ error: "Price is Required" });
            case !category:
                return res.status(500).send({ error: "Category is Required" });
            case !quantity:
                return res.status(500).send({ error: "Quantity is Required" });
            case photo && photo.size > 1000000:
                return res
                    .status(500)
                    .send({ error: "photo is Required and should be less then 1mb" });
        }

        const products = await ProductModel.findByIdAndUpdate(
            req.params.pid,
            { ...req.fields, slug: slugify(name) },
            { new: true }
        );
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({
            success: true,
            message: "Product Updated Successfully",
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in Updte product",
        });
    }
};

//get all product controller
export const getProductController = async (req, res) => {
    try {
        const products = await ProductModel
            .find({})
            .populate('category')
            .select("-photo")
            .limit(12)
            .sort({ createdAt: -1 });
        res.send({
            success: true,
            totalCount: products.length,
            message: 'All Products ',
            products
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in getting  product',
            error
        })
    }
}

//get single product controller

export const getSingleProductController = async (req, res) => {
    try {
        const {pid}= await req.params;
        const product = await ProductModel
            .findById(pid)
            .select('-photo')
            .populate('category');
        res.status(200).send({
            success: true,
            message: 'Single product fetched',
            product
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in getting single product',
            error
        })
    }
}

//get product photo controller

export const productPhotoController = async (req, res) => {
    try {
        const product = await ProductModel.findById(req.params.pid).select("photo");
        if (product.photo.data) {
            res.set('content-type', product.photo.contentType)
            return res.status(200).send(product.photo.data)
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in getting product photo',
            error
        })
    }
}

//search product
export const searchProductController = async (req, res) => {
    try {
        const { keyword } = req.params
        const results = await ProductModel.find({
            $or: [
                { name: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ]
        }).select("-photo")
        res.json(results)
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: 'Error in searching product',
            error
        })
    }
}

//product category by single category

export const productCategoryController = async (req, res) => {
    try {
        const category = await CategoryModel.findOne({ slug: req.params.slug })
        const products = await ProductModel.find({ category }).populate('category')
        res.status(200).send({
            success: true,
            message: 'Product fetched successfully by category',
            category,
            products
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: 'Error while getting product by category',
            error
        })
    }
}


//deleting product controller

export const deleteProductController = async (req, res) => {
    try {
        const product = await ProductModel.findByIdAndDelete(req.params.pid).select("-photo");
        await User.updateOne({
            _id: product.user._id
        }, {
            $pull: {
                product: product._id
            }
        })
        res.status(200).send({
            success: true,
            message: 'Product deleted succesfully',
            product
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in deleting product',
            error
        })
    }
}