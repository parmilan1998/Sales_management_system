const { Op } = require("sequelize");
const { validationResult } = require('express-validator');
const Product = require("../models/products");
const Category = require("../models/category");

exports.createProduct = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const products = req.body;

    try {
        const createdProducts = await Promise.all(products.map(async (product) => {
            const { ProductName, CategoryName, PDescription, UnitPrice, M_Date, E_Date } = product;

            const category = await Category.findOne({ where: { categoryName: CategoryName } });

            if (!category) {
                throw new Error(`Category ${CategoryName} not found.`);
            }

            const newProduct = await Product.create({
                ProductName,
                PDescription,
                UnitPrice,
                M_Date,
                E_Date,
                categoryID: category.categoryID
            });

            return newProduct;
        }));

        res.status(201).json({ message: 'Products added successfully', results: createdProducts });
    } catch (error) {
        console.error('Error adding products:', error.message);
        res.status(500).json({ message: 'Error adding products', error: error.message });
    }
};



exports.getAllProduct = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (error) {
        console.error('Error retrieving products:', error);
        res.status(500).send('Error retrieving products');
    }
};

exports.getProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error('Error retrieving product:', error);
        res.status(500).send('Error retrieving product');
    }
};



exports.updateProduct = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { ProductName, CategoryName, PDescription, UnitPrice, M_Date, E_Date } = req.body;

    try {
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let category;
        if (CategoryName) {
            category = await Category.findOne({ where: { categoryName: CategoryName } });

            if (!category) {
                throw new Error(`Category ${CategoryName} not found.`);
            }
        }

        await product.update({
            ProductName,
            PDescription,
            UnitPrice,
            M_Date,
            E_Date,
            CategoryID: category ? category.CategoryID : null
        });

        res.status(200).send('Product updated successfully');
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).send('Error updating product');
    }
};


exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.destroy();
        res.status(200).send('Product deleted successfully');
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).send('Error deleting product');
    }
};

exports.searchProduct = async (req, res) => {
    const { ProductName, CategoryName } = req.query;

    try {
        let whereCondition = {};

        if (ProductName) {
            whereCondition.ProductName = {
                [Op.like]: `%${ProductName}%`
            };
        }

        let include = [];

        if (CategoryName) {
            include.push({
                model: Category,
                where: {
                    categoryName: {
                        [Op.like]: `%${CategoryName}%`
                    }
                }
            });
        }

        const product = await Product.findOne({
            where: whereCondition,
            include: include
        });
        if (product) {
        res.json(product);
        }
    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).send('Error searching products');
    }
};
