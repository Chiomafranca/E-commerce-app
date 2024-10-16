const express = require('express');
const Product = require('../models/Product');
const { verifyToken, verifyTokenAndAdmin } = require('./verifyToken'); 
const router = express.Router();

// UPDATE PRODUCT
router.put("/:id", async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json("Product not found");
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CREATE PRODUCT
router.post("/", async (req, res) => {
    const newProduct = new Product(req.body);

    try {
        const savedProduct = await newProduct.save();
        if (savedProduct) {
            res.status(201).json(savedProduct);
        } else {
            res.status(400).json({ message: "Product not saved." });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// DELETE PRODUCT
router.delete('/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        
        if (!deletedProduct) {
            return res.status(404).json("Product not found");
        }

        res.status(200).json("Product has been deleted.");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET PRODUCT
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
      
        if (!product) {
            return res.status(404).json("Product not found");
        }
        res.status(200).json(product); 
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET ALL PRODUCTS
router.get('/', async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;

    try {
        let products;

        if (qNew) {
            products = await Product.find().sort({ createdAt: -1 }).limit(5);
        } else if (qCategory) {
            products = await Product.find({
                categories: {
                    $in: [qCategory],
                },
            });
        } else {
            products = await Product.find();
        }

        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
