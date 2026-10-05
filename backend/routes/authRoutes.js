const express = require("express");

const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  registerUser,
  verifyOTP,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  addAddress,
  getAddresses,
  deleteAddress,
   adminLogin,
} = require("../controllers/authController");

router.post("/register", registerUser);

router.post("/verify-otp", verifyOTP);

router.post("/login", loginUser);
router.post("/admin/login", adminLogin);

router.post("/logout", logoutUser);

router.get(
  "/profile/:id",
  protect,
  getUserProfile
);

router.put(
  "/profile/:id",
  protect,
  updateUserProfile
);

router.post(
  "/address/:userId",
  protect,
  addAddress
);

router.get(
  "/address/:userId",
  protect,
  getAddresses
);

router.delete(
  "/address/:userId/:addressId",
  protect,
  deleteAddress
);

router.put(
  "/change-password",
  protect,
  changePassword
);

module.exports = router;