const jwt = require("jsonwebtoken");

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.JWT_SEC, (err, user) => {
            if (err) {
                return res.status(403).json({ message: "Token is not valid" });
            }
            req.user = user; 
            next(); 
        });
    } else {
        return res.status(401).json({ message: "You are not authenticated!" });
    }
};

// Middleware to verify token and user authorization
const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        const isAuthorized = req.user && (req.user.id === req.params.id || req.user.isAdmin);
        if (isAuthorized) {
            next();
        } else {
            return res.status(403).json({ message: "You are not allowed to do that!" });
        }
    });
};

// Middleware to verify token and admin privileges
const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user && req.user.isAdmin) {
            next();
        } else {
            return res.status(403).json({ message: "You are not allowed to do that!" });
        }
    });
};

module.exports = {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin
};
