const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Shop = require("../models/Shop");

const protect = async (req, res, next) => {
  console.log("Protect middleware called"); // Debugging line
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
          console.log("Token found in headers"); // Debugging line
            token = req.headers.authorization.split(" ")[1];
            console.log("Token:", token); // Debugging line
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Decoded token:", decoded); // Debugging line
            req.user = await User.findById(decoded.userId).select("-password");
            console.log("User found:", req.user); // Debugging line
            next();
        } catch (error) {
            res.status(401).json({ success: false, message: "Not authorized, token failed" });
        }
    } else {
        res.status(401).json({ success: false, message: "Not authorized, no token" });
    }
};


const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
      console.log("Authorize middleware called"); // Debugging line
      console.log("User role:", req.user ? req.user.role : "No user"); // Debugging line
      console.log("Allowed roles:", allowedRoles); // Debugging line
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: "Forbidden: Access is denied" });
      }
      next();
    };
  };


const authorizeSeller = async (req, res, next) => {
  if (!req.user || req.user.role !== 'seller') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const shop = await Shop.findOne({ user: req.user._id });
  if (!shop) {
    return res.status(404).json({ message: 'Shop not found for this seller' });
  }

  req.shop = shop; // inject shop into request object
  next();
};

  

  
module.exports = { protect, authorizeRoles , authorizeSeller };
