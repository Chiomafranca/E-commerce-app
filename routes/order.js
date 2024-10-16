const express = require('express');
const Order = require('../models/Order'); 
const router = express.Router();

// UPDATE ORDER
router.put("/:id", async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true } 
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
        
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CREATE ORDER
router.post("/", async (req, res) => {
    const newOrder = new Order(req.body);

    try {
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(500).json({ error: error.message }); 
    }
});


// DELETE ORDER
router.delete('/:id', async (req, res) => {
    try {
       const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        
        if (!deletedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json("Order has been deleted.");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET USER ORDER
router.get('/:id', async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.id }); 

        if (!orders.length) {
            return res.status(404).json({ message: "No orders found for this user" });
        }

        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET ALL ORDERS
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find();

        if (!orders.length) {
            return res.status(404).json({ message: 'No orders found' });
        }
        
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// GET MONTHLY INCOME
router.get('/income', async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(lastMonth.setMonth(lastMonth.getMonth() - 1));

    try {
        const income = await Order.aggregate([
            { $match: { createdAt: { $gte: previousMonth } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount"
                }
            },
            {
                $group: {
                    _id: "$month",
                    totalSales: { $sum: "$sales" }
                }
            }
        ]);
        res.status(200).json(income);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = router;
