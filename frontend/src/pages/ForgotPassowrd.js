import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SummaryApi from "../common";
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [errors, setErrors] = useState({});
  const [sessionId, setSessionId] = useState('');
  const navigate = useNavigate();
  const [data, setData] = useState({
    mobileNo: "",
    newPassword: "",
    confirmPassword: "",
  });

  const API_KEY = '2c88d675-c1d8-11ef-8b17-0200cd936042';

  const validate = () => {
    const newErrors = {};
    if (!data.mobileNo) {
      newErrors.mobileNo = "Mobile number is required";
    } else if (!/^\d{10}$/.test(data.mobileNo)) {
      newErrors.mobileNo = "Enter a valid 10-digit mobile number";
    }
    if (!data.newPassword) {
      newErrors.newPassword = "Password is required";
    } else if (data.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters long";
    }
    if (data.newPassword !== data.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendOtp = async () => {
    if (!data.mobileNo || !/^\d{10}$/.test(data.mobileNo)) {
      toast.error("Enter a valid mobile number");
      return;
    }
    try {
      const response = await fetch(`https://2factor.in/API/V1/${API_KEY}/SMS/${data.mobileNo}/AUTOGEN2/OTP1`, {
        method: "POST"
      });
      const result = await response.json();
      if (result.Status === "Success") {
        setOtpSent(true);
        setSessionId(result.Details);
        toast.success("OTP sent to your mobile number");
      } else {
        toast.error("Failed to send OTP");
      }
    } catch (error) {
      toast.error("Error sending OTP");
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }
    try {
      const response = await fetch(`https://2factor.in/API/V1/${API_KEY}/SMS/VERIFY/${sessionId}/${otp}`, {
        method: "GET"
      });
      const result = await response.json();
      if (result.Status === "Success") {
        setOtpVerified(true);
        toast.success("Mobile number verified successfully");
      } else {
        toast.error("Invalid OTP");
      }
    } catch (error) {
      toast.error("Error verifying OTP");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpVerified) {
      toast.error("Please verify OTP before resetting password");
      return;
    }
    if (!validate()) {
      return;
    }

    try {
      const response = await fetch(SummaryApi.forgetpassword.url, {
        method: SummaryApi.forgetpassword.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobileNo: data.mobileNo,
          newPassword: data.newPassword,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Password updated successfully");
        navigate('/login');
      } else {
        toast.error(result.message || "An error occurred");
      }
    } catch (error) {
      toast.error("An error occurred while processing your request");
    }
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: ""
    }));
  };

  return (
    <section id="forgot-password">
      <div className="mx-auto container p-4">
        <div className="bg-white p-5 w-full max-w-sm mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>
          <form className="pt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className='grid'>
              <label>Mobile No:</label>
              <div className='flex gap-2 items-center'>
                <input
                  type='number'
                  placeholder='Enter Mobile No'
                  name='mobileNo'
                  value={data.mobileNo}
                  onChange={handleOnChange}
                  className='w-full bg-slate-100 p-2 outline-none'
                  onWheel={(e) => e.target.blur()}
                />
                <button
                  type='button'
                  className='bg-blue-500 text-white px-4 py-1 rounded'
                  onClick={sendOtp}
                  disabled={otpSent || otpVerified}
                >
                  {otpVerified ? "Verified" : "Send OTP"}
                </button>
              </div>
              {errors.mobileNo && <p className='text-red-500 text-sm'>{errors.mobileNo}</p>}
            </div>

            {otpSent && !otpVerified && (
              <div className='grid'>
                <label>Enter OTP:</label>
                <div className='flex gap-2 items-center'>
                  <input
                    type='number'
                    placeholder='Enter OTP'
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className='w-full bg-slate-100 p-2 outline-none'
                  />
                  <button
                    type='button'
                    className='bg-green-500 text-white px-4 py-1 rounded'
                    onClick={verifyOtp}
                  >
                    Verify OTP
                  </button>
                </div>
              </div>
            )}

            <div>
              <label>New Password: </label>
              <input
                type="password"
                name="newPassword"
                placeholder="Enter new password"
                value={data.newPassword}
                onChange={handleOnChange}
                className="w-full bg-slate-100 p-2 outline-none"
              />
            </div>
            <div>
              <label>Confirm Password: </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm new password"
                value={data.confirmPassword}
                onChange={handleOnChange}
                className="w-full bg-slate-100 p-2 outline-none"
              />
            </div>
            {errors.confirmPassword && <p className='text-red-500 text-sm'>{errors.confirmPassword}</p>}
            <button className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 w-full rounded mt-6">
              Submit
            </button>
          </form>
          <Link to="/login" className="block text-center mt-6 text-blue-500 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
