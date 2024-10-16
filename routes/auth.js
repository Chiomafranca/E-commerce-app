const router = require('express').Router();
const User = require('../models/User');
const CryptoJs = require('crypto-js');
const jwt = require("jsonwebtoken");

// REGISTER
router.post('/register', async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJs.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
    });

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error saving user." });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(401).json("Wrong credentials!");
        }

        const hashPassword = CryptoJs.AES.decrypt(user.password, process.env.PASS_SEC);
        const password = hashPassword.toString(CryptoJs.enc.Utf8);

        if (password !== req.body.password) {
            return res.status(401).json("Wrong credentials!");
        }

        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_SEC,
            { expiresIn: '3d' }
        );

        const { password: userPassword, ...others } = user._doc;

        res.status(200).json({ ...others, accessToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong!" });
    }
});

module.exports = router;
