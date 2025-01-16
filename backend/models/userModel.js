const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    name: String,
    mobileNo: Number,
    street: String,
    city: String,
    state: String,
    zip: String,
});

const refferalSchema = new mongoose.Schema({
    refferalcode: String,
    refferredbycode: String,
    myrefferals: [
        // your schema fields
    ]
});

const userSchema = new mongoose.Schema({
    // your schema fields
    mobileNo: { type: Number, required: true, unique: true },
    role: { type: String, default: 'USER' },
    address: addressSchema,
    refferal: refferalSchema,
    businessPrices: {
        myPurchase: { type: Number, default: 0 },
        totalPurchase: { type: Number, default: 0 },
        totalIncentive: { type: Number, default: 0 }
    },
    otp: String,  // Field to store the OTP
    otpExpires: Date,
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = { User };