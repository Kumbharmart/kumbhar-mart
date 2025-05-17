import React from "react";
import { Link } from "react-router-dom";

const SalesmenDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-blue-900">Salesmen Dashboard</h1>
        
        {/* Sales Overview */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-100 p-4 rounded-lg text-center">
            <h2 className="text-xl font-semibold">Total Sales</h2>
            <p className="text-2xl font-bold">$5,230</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg text-center">
            <h2 className="text-xl font-semibold">Commission</h2>
            <p className="text-2xl font-bold">$1,250</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg text-center">
            <h2 className="text-xl font-semibold">Pending Orders</h2>
            <p className="text-2xl font-bold">8</p>
          </div>
        </div>
        
        {/* Recent Orders */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-3">Recent Orders</h2>
          <ul>
            <li className="py-2 border-b">Order #1234 - $200 - <span className="text-green-600">Completed</span></li>
            <li className="py-2 border-b">Order #1235 - $150 - <span className="text-yellow-600">Pending</span></li>
            <li className="py-2 border-b">Order #1236 - $300 - <span className="text-red-600">Canceled</span></li>
          </ul>
        </div>
        
        {/* Navigation Links */}
        <div className="mt-6 flex justify-between">
          <Link to="/profile" className="text-blue-700 hover:underline">Profile</Link>
          <Link to="/settings" className="text-blue-700 hover:underline">Settings</Link>
          <Link to="/logout" className="text-red-700 hover:underline">Logout</Link>
        </div>
      </div>
    </div>
  );
};

export default SalesmenDashboard;
