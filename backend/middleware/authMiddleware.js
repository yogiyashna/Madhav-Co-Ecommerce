const jwt = require("jsonwebtoken");
const User = require("../model/User");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      console.log("AUTH TOKEN RECEIVED:", !!token);
      console.log("JWT SECRET EXISTS:", !!process.env.JWT_SECRET);

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      console.log("DECODED TOKEN:", decoded);

      req.user = await User.findById(decoded.id).select("-password");

      console.log("USER FOUND:", !!req.user);

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      next();

    } catch (error) {
      console.error("AUTH MIDDLEWARE ERROR:");
      console.error("NAME:", error.name);
      console.error("MESSAGE:", error.message);

      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }
};

module.exports = protect;