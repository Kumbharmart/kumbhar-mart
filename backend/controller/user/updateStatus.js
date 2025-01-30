const userModel = require("../../models/userModel");

async function updateStatus(req, res) {
    const { userId, month, newStatus } = req.body;

    // Validate the required fields
    if (!userId || !month || !newStatus) {
        return res.status(400).json({
            message: "Missing required fields: userId, month, or newStatus",
            error: true,
            success: false
        });
    }

    try {
        // Find the user by ID
        const user = await userModel.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        // Find the business price entry for the specified month
        const businessPriceEntry = user.businessPrices.find(entry => entry.month === month);

        if (businessPriceEntry) {
            // Update the status of the entry
            businessPriceEntry.status = newStatus;

            // Save the updated user document
            await user.save();

            return res.json({
                message: "Status updated successfully",
                success: true,
                error: false
            });
        } else {
            return res.status(404).json({
                message: "Business price entry not found for the specified month",
                error: true,
                success: false
            });
        }
    } catch (err) {
        console.error("Error updating status:", err);
        return res.status(500).json({
            message: "Server error",
            error: true,
            success: false
        });
    }
}

module.exports = updateStatus;
