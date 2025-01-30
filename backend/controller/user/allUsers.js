const userModel = require("../../models/userModel");

// ✅ Fetch all users with businessPrices
async function allUsers(req, res) {
    try {
        const allUsers = await userModel.find({}, 'name businessPrices');

        res.json({
            message: "All Users Fetched Successfully",
            data: allUsers,
            success: true,
            error: false
        });
    } catch (err) {
        res.status(400).json({
            message: err.message || "Error fetching users",
            error: true,
            success: false
        });
    }
}

module.exports = { allUsers} ;
