import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SummaryApi from "../../common";

const SalesmenLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields.");
      return;
    }
  
    console.log("Submitting Login Request:", formData); // Log request data
  
    try {
      const response = await fetch(SummaryApi.salesmanLogin.url, {
        method: SummaryApi.salesmanLogin.method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      console.log("Response Status:", response.status); // Log status code
  
      const dataApi = await response.json();
  
      console.log("API Response:", dataApi); // Log full response
  
      if (dataApi.success) {
        toast.success("Login successful!");
        navigate("/salesmen-dashboard");
      } else {
        toast.error(dataApi.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login. Please try again.");
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Salesman Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          className="w-full p-2 border rounded-lg mb-4"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-2 border rounded-lg mb-4"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
        <button className="w-full bg-blue-600 text-white p-2 rounded-lg" onClick={handleSubmit}>
          Login
        </button>
        <p className="mt-4 text-center">
          Don't have an account? <Link to="/salesmen" className="text-blue-600">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default SalesmenLogin;
