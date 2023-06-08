import productModel from "../Models/productModel.js";

export const createProductController = async (req, res) => {
    try {
        const { name, description, price } = req.fields;
        //validation
        switch (true) {
            case !name:
                return res.status(500).send({ error: 'Name is required' });

            case !description:
                return res.status(500).send({ error: 'Description is required' });

            case !price:
                return res.status(500).send({ error: 'Price is required' });

        }

        const products = new productModel({ ...req.fields });
        

        await products.save();

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

//get all product controller
export const getProductController = async (req, res) => {
    try {
        const products = await productModel
            .find({})
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