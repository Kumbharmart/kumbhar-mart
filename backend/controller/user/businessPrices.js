const User = require('../../models/userModel'); // Import the User model
const moment = require('moment');

// Controller to handle saving prices in the database
const businessPrices = async (req, res) => {
  const { totalBusiness, totalIntensive, totalPurchasing, userId } = req.body;

  if (!userId || totalBusiness === undefined || totalIntensive === undefined || totalPurchasing === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
      const currentMonth = moment().format('YYYY-MM'); // Get current month in YYYY-MM format
      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Ensure `businessPrices` array exists
      if (!Array.isArray(user.businessPrices)) {
          user.businessPrices = [];
      }

      // Check if an entry for the current month exists
      let existingMonthData = user.businessPrices.find(entry => entry.month === currentMonth);

      if (existingMonthData) {
          // Update existing month data
          existingMonthData.myPurchase = totalPurchasing;
          existingMonthData.totalPurchase = totalBusiness;
          existingMonthData.totalIncentive = totalIntensive;
      } else {
          // Add new month's entry if not found
          user.businessPrices.push({
              month: currentMonth,
              myPurchase: totalPurchasing,
              totalPurchase: totalBusiness,
              totalIncentive: totalIntensive,
              status: 'pending' // Default status
          });
      }

      await user.save();

      res.status(200).json({ message: 'Business prices updated successfully', user });
  } catch (error) {
      console.error('Error updating business prices:', error);
      res.status(500).json({ message: 'Server error' });
  }
};

module.exports = businessPrices;
