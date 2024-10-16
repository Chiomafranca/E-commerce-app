const express = require('express');
const Cart = require('../models/Cart');
const router = express.Router();

// UPDATE CART
router.put("/:id", async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(
            req.params.id,
            { $set: req.body},
            { new: true }
        );
        if (!updatedCart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CREATE CART
router.post("/", async (req, res) => { 
    const newCart = new Cart(req.body);

    try {
        const savedCart = await newCart.save();
        res.status(201).json(savedCart); 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE CART
router.delete('/:id', async (req, res) => {
    try {
        const deletedCart = await Cart.findByIdAndDelete(req.params.id);
        if (!deletedCart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.status(200).json("Cart has been deleted.");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET USER CART
router.get('/:id', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.id);

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET ALL CARTS
router.get('/', async (req, res) => {
    try {
        const carts = await Cart.find();

        if (!carts.length) {
            return res.status(404).json({ message: 'No carts found' });
        }
        
        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
module.exports = router;
