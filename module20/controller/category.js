import slugify from "slugify";
import CategoryModel from "../models/CategoryModel.js";
import User from "../models/User.js";

//create category
export const createCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(401).send({
                message: 'Category name is Required'
            })
        }

        const existingCategory = await CategoryModel.findOne({ name });
        if (existingCategory) {
            return res.status(200).send({
                success: true,
                message: 'Category Already Exists'
            })
        }

        const category = await new CategoryModel({
            name,
            slug: slugify(name),
            user: req.user._id
        }).save();
        await User.updateOne({
            _id: req.user._id
        }, {
            $push: {
                category: category._id
            }
        })
        res.status(201).send({
            success: true,
            message: 'New Category Created',
            category
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Category',
            error
        })
    }
}

//updating category
export const updateCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;
        const category = await CategoryModel.findByIdAndUpdate(id, {
            name,
            slug: slugify(name)
        }, {
            new: true
        });

        res.status(200).send({
            success: true,
            message: 'Category Updated Successfully',
            category
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error while updating category',
            error
        })
    }
}
//get all category
export const getAllCategoryController = async (req, res) => {
    try {
        const category = await CategoryModel.find({});
        res.status(200).send({
            success: true,
            message: 'All Categories list',
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in categories',
            error
        })
    }
}
//single category 
export const getSingleCategoryController = async (req, res) => {
    try {
        const category = await CategoryModel.findOne({
            slug: req.params.slug
        });

        res.status(200).send({
            success: true,
            message: 'Get Single Category Successfully',
            category
        })


    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in single categories',
            error
        })
    }
}
//deleting category
export const deleteCategoryController = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await CategoryModel.findByIdAndDelete(id)
        await User.updateOne({
            _id: category.user._id
        }, {
            $pull: {
                category: category._id
            }
        })
        res.status(200).send({
            success: true,
            message: 'Category Deleted successfully',
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in deleteing categories',
            error
        })
    }
}