const bcrypt = require('bcryptjs');
const Seller = require('../../models/sellerModel');

async function sellerSignUp(req, res) {
    try {
        const { mobile, email, gstin, password, fullName, displayName } = req.body;

        // Validate required fields
        if (!mobile || !email || !gstin || !password || !fullName || !displayName) {
            return res.status(400).json({ message: 'All fields (mobile, email, gstin, password, fullName, displayName) are required.' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format.' });
        }

        // Validate mobile number (10 digits)
        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(mobile)) {
            return res.status(400).json({ message: 'Invalid mobile number format. Must be 10 digits.' });
        }

        // Validate GSTIN format (15 characters)
        const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
        if (!gstinRegex.test(gstin)) {
            return res.status(400).json({ message: 'Invalid GSTIN format.' });
        }

        // Check if seller already exists
        const existingSeller = await Seller.findOne({ $or: [{ mobile }, { email }, { gstin }] });
        if (existingSeller) {
            return res.status(400).json({ message: 'Seller already exists with this mobile, email, or GSTIN.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new seller instance
        const seller = new Seller({
            mobile,
            email,
            gstin,
            password: hashedPassword,
            fullName,
            displayName,
        });

        // Save the seller to the database
        await seller.save();

        return res.status(201).json({
            data: seller,
            success: true,
            error: false,
            message: 'User created successfully',
        });
    } catch (error) {
        console.error('Error registering seller:', error);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
}

module.exports = sellerSignUp;
