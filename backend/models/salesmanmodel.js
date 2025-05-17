const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const salesmanSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    totalCommission: { type: Number, default: 0 },
});

// Hash password before saving
salesmanSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare hashed password
salesmanSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const Salesman = mongoose.model("Salesman", salesmanSchema);
module.exports = Salesman;
