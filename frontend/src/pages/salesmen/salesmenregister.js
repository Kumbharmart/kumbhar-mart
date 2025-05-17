import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import SummaryApi from "../../common";

const SalesmanRegister = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    const payload = {
      mobile: formData.mobile,
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
    };

    try {
      const response = await fetch(SummaryApi.salesmensignup.url, {
        method: SummaryApi.salesmensignup.method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const dataApi = await response.json();

      if (dataApi.success) {
        toast.success(dataApi.message);
        navigate("/salesmen-login");
      } else {
        toast.error(dataApi.message);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("An error occurred during registration. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-8">
        <div className="flex justify-between mb-6 text-sm font-medium">
          <span className={`flex items-center ${step >= 1 ? "text-blue-600" : "text-gray-400"}`}>
            <FaCheckCircle className="mr-2" /> Personal Info
          </span>
          <span className={`flex items-center ${step >= 2 ? "text-blue-600" : "text-gray-400"}`}>
            <FaCheckCircle className="mr-2" /> Password Setup
          </span>
        </div>

        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Step 1: Salesman Information</h2>
            <input
              type="text"
              name="mobile"
              placeholder="Mobile Number"
              className="w-full p-2 border rounded-lg mb-3"
              value={formData.mobile}
              onChange={handleInputChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="w-full p-2 border rounded-lg mb-3"
              value={formData.email}
              onChange={handleInputChange}
            />
            <p className="text-xs text-gray-500 mt-2">
              By continuing, you agree to the platform’s <a href="#" className="text-blue-600">Terms & Conditions</a> and <a href="#" className="text-blue-600">Privacy Policy</a>.
            </p>
            <button className="w-full bg-blue-600 text-white p-2 rounded-lg mt-4" onClick={() => setStep(2)}>
              Continue →
            </button>
            <Link to="/salesmen-login" className="block text-center text-blue-600 mt-2">Already have an account? Login</Link>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Step 2: Password Creation</h2>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full p-2 border rounded-lg mb-3"
              value={formData.password}
              onChange={handleInputChange}
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="w-full p-2 border rounded-lg mb-3"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              className="w-full p-2 border rounded-lg mb-3"
              value={formData.fullName}
              onChange={handleInputChange}
            />
            <div className="flex justify-between mt-4">
              <button className="bg-gray-500 text-white p-2 rounded-lg" onClick={() => setStep(1)}>
                ← Back
              </button>
              <button className="bg-blue-600 text-white p-2 rounded-lg" onClick={handleSubmit}>
                Register →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesmanRegister;
