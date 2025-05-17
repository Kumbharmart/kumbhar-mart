const bcrypt = require("bcryptjs");
const Salesman = require("../../models/salesmanmodel");
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Ensure dotenv is loaded

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.SELLER_TOKEN_SECRET_KEY, { expiresIn: "30d" });
};

// Register Salesman
exports.salesmanSignUp = async (req, res) => {
    try {
        const { fullName, mobile, email, password } = req.body;

        // Validate required fields
        if (!fullName || !mobile || !email || !password) {
            return res.status(400).json({ message: "All fields (fullName, mobile, email, password) are required." });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format." });
        }

        // Validate mobile number (10 digits)
        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(mobile)) {
            return res.status(400).json({ message: "Invalid mobile number format. Must be 10 digits." });
        }

        // Check if salesman already exists
        const existingSalesman = await Salesman.findOne({ $or: [{ mobile }, { email }] });
        if (existingSalesman) {
            return res.status(400).json({ message: "Salesman already exists with this mobile or email." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new salesman instance
        const salesman = new Salesman({
            fullName,
            mobile,
            email,
            password: hashedPassword,
        });

        // Save to database
        await salesman.save();

        return res.status(201).json({
            data: salesman,
            success: true,
            error: false,
            message: "Salesman registered successfully",
            token: generateToken(salesman.id),
        });
    } catch (error) {
        console.error("Error registering salesman:", error);
        return res.status(500).json({ message: "Server error. Please try again later." });
    }
};

// Salesman Login
exports.salesmanLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate fields
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        console.log("Login Request - Email:", email);
        
        // Check if salesman exists
        const salesman = await Salesman.findOne({ email });

        console.log("Found Salesman:", salesman); // Debug log

        if (!salesman) {
            return res.status(401).json({ message: "Invalid email" });
        }

        // Check password comparison
        const isMatch = await bcrypt.compare(password, salesman.password);
        
        console.log("Password Match:", isMatch); // Debug log

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        res.json({
            _id: salesman.id,
            fullName: salesman.fullName,
            mobile: salesman.mobile,
            email: salesman.email,
            token: generateToken(salesman.id),
        });
    } catch (error) {
        console.error("Error logging in salesman:", error);
        return res.status(500).json({ message: "Server error. Please try again later." });
    }
};

