const express = require('express');
const CryptoJs = require('crypto-js');
const User = require('../models/User');

const router = express.Router();


router.put("/:id", async (req, res) => {
    try {
        if (req.body.password) {
            req.body.password = CryptoJs.AES.encrypt(
                req.body.password,
                process.env.PASS_SEC
            ).toString();
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json("User not found");
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.delete('/:id',  async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        
        if (!deletedUser) {
            return res.status(404).json("User not found");
        }
        res.status(200).json("User has been deleted.");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
      
        if (!user) {
            return res.status(404).json("User not found");
        }
        const { password: userPassword, ...others } = user._doc;

        res.status(200).json(others);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.get('/', async (req, res) => {
    const query = req.query.new;

    try {
        const users = query 
            ? await User.find().sort({_id: -1}).limit(5)
            : await User.find();
        
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.get("/stats/public", async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    try {
        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 },
                },
            },
        ]);

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
