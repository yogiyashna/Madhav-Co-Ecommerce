const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./model/User");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const adminEmail = "admin@madhavco.com";
    const adminPassword = "Admin@123";

    const existingAdmin = await User.findOne({
      email: adminEmail,
    });

    if (existingAdmin) {
      console.log("Admin already exists");

      // Make sure the existing account is actually admin
      existingAdmin.role = "admin";
      existingAdmin.isVerified = true;

      await existingAdmin.save();

      console.log("Existing account updated to ADMIN");

      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(
      adminPassword,
      10
    );

    const admin = await User.create({
      name: "Madhav Admin",
      email: adminEmail,
      password: hashedPassword,
      phone: "",
      role: "admin",
      isVerified: true,
    });

    console.log("================================");
    console.log("ADMIN CREATED SUCCESSFULLY");
    console.log("Email:", admin.email);
    console.log("Password:", adminPassword);
    console.log("Role:", admin.role);
    console.log("================================");

    process.exit(0);

  } catch (error) {
    console.error("CREATE ADMIN ERROR:", error);
    process.exit(1);
  }
};

createAdmin();