import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRegCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import SummaryApi from "../../common";

const SellerPanel = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    mobile: "",
    email: "",
    gstin: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    displayName: "",
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
      gstin: formData.gstin,
      password: formData.password,
      fullName: formData.fullName,
      displayName: formData.displayName,
    };

    try {
      const response = await fetch(SummaryApi.sellerSignUP.url, {
        method: SummaryApi.sellerSignUP.method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const dataApi = await response.json();

      if (dataApi.success) {
        toast.success(dataApi.message);
        navigate("/sellerlogin");
      } else {
        toast.error(dataApi.message);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("An error occurred during registration. Please try again.");
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col lg:flex-row w-11/12 mx-auto rounded-lg overflow-hidden">
        <div className="w-full lg:w-1/2 p-8">
          <div className="flex justify-between mb-8 text-base font-semibold">
            <span className={`step ${step >= 1 ? "text-blue-900" : "text-gray-400"} flex items-center`}>
              <FaRegCheckCircle className="m-2" /> Email & GST
            </span>
            <span className={`step ${step >= 2 ? "text-blue-900" : "text-gray-400"} flex items-center`}>
              <FaRegCheckCircle className="m-2" /> Password Creation
            </span>
            <span className={`step ${step === 3 ? "text-blue-900" : "text-gray-400"} flex items-center`}>
              <FaRegCheckCircle className="m-2" /> Onboarding Dashboard
            </span>
          </div>

          {step === 1 && (
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold mb-6 text-sky-900">Step 1: Seller Information</h2>

              <input
                type="text"
                name="mobile"
                placeholder="Mobile Number"
                className="input p-2 border-2 rounded-lg border-gray-400 mb-5"
                value={formData.mobile}
                onChange={handleInputChange}
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="input p-2 border-2 rounded-lg border-gray-400 mb-5"
                value={formData.email}
                onChange={handleInputChange}
                required
              />

              <input
                type="text"
                name="gstin"
                placeholder="GSTIN"
                className="input p-2 border-2 rounded-lg border-gray-400"
                value={formData.gstin}
                onChange={handleInputChange}
                required
              />

              <p className="text-sm mt-2 text-gray-600">
                We require GSTIN for tax compliance as per government norms.
              </p>

              <p className="text-sm mt-4">
                By continuing, I agree to YMLMart’s {" "}
                <a href="#" className="text-blue-600 underline">Terms & Conditions</a> and {" "}
                <a href="#" className="text-blue-600 underline">Privacy Policy</a>.
              </p>

              <button className="btn-blue mt-6" onClick={nextStep}>Continue for registration →</button>
              <Link to="/sellerlogin" className="ml-4">Login →</Link>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold mb-6 text-blue-900">Step 2: Password Creation</h2>

              <input
                type="password"
                name="password"
                placeholder="Password"
                className="input p-2 border-2 rounded-lg border-gray-400 mb-5"
                value={formData.password}
                onChange={handleInputChange}
                required
              />

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className="input p-2 border-2 rounded-lg border-gray-400 mb-5"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />

              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                className="input p-2 border-2 rounded-lg border-gray-400 mb-5"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />

              <input
                type="text"
                name="displayName"
                placeholder="Display Name"
                className="input p-2 border-2 rounded-lg border-gray-400 mb-5"
                value={formData.displayName}
                onChange={handleInputChange}
                required
              />

              <button className="btn-gray" onClick={prevStep}>← Back</button>
              <button className="btn-blue ml-4" onClick={handleSubmit}>Register →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerPanel;
