import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import moment from 'moment';
import Loader from '../components/Loader';

const Financial = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState('');

    const fetchAllUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch(SummaryApi.allUser.url, {
                method: SummaryApi.allUser.method,
                credentials: 'include'
            });

            const dataResponse = await response.json();
            if (dataResponse.success) {
                setAllUsers(dataResponse.data);
            } else {
                toast.error('Error fetching user details');
            }
        } catch (error) {
            toast.error('Error fetching user details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllUsers();
    }, []);

    const updateUserStatus = async (userId, month, newStatus) => {
        console.log("🔵 Sending Request to Change Status:", { userId, month, newStatus });
    
        // Check if the required fields are provided
        if (!userId || !month || !newStatus) {
            console.error("❌ Missing required fields: userId, month, or newStatus");
            toast.error("Missing required fields: userId, month, or newStatus");
            return;
        }
    
        try {
            // Send the PATCH request to update status
            const response = await fetch(SummaryApi.updateStatus.url, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userId, month, newStatus }), // Request body being sent
                credentials: "include"
            });
    
            // Log the status of the response
            console.log("🟠 Response Status:", response.status);
    
            // Check if the response is successful
            if (response.ok) {
                const data = await response.json();
                console.log("🟢 API Response:", data);
    
                if (data.success) {
                    toast.success("Status updated successfully!");
                    fetchAllUsers(); // Refresh users after update
                } else {
                    console.error("❌ Failed to update status:", data.message);
                    toast.error(data.message || "Failed to update status");
                }
            } else {
                console.error("❌ Error in API response:", response.statusText);
                toast.error("Failed to update status - " + response.statusText);
            }
        } catch (error) {
            console.error("❌ Error updating status:", error);
            toast.error("Error updating status");
        }
    };
    
    

    const filteredUsers = selectedMonth
        ? allUsers.map(user => ({
              ...user,
              businessPrices: user.businessPrices.filter(entry => entry.month === selectedMonth)
          })).filter(user => user.businessPrices.length > 0)
        : allUsers;

    return (
        <div className='bg-white p-4'>
            <h2 className='text-2xl font-bold mb-4'>Financial Overview</h2>

            <div className="mb-4">
                <label className="mr-2">Filter by Month:</label>
                <select
                    className="border p-2 rounded"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                >
                    <option value="">All Months</option>
                    {[...new Set(allUsers.flatMap(user => user.businessPrices.map(bp => bp.month)))]
                        .map(month => (
                            <option key={month} value={month}>
                                {month || 'Invalid Date'}
                            </option>
                        ))}
                </select>
            </div>

            {loading ? (
                <div className="flex justify-center items-center w-full h-64">
                    <Loader />
                </div>
            ) : (
                <table className='w-full userTable'>
                    <thead>
                        <tr className='bg-black text-white'>
                            <th>Sr.</th>
                            <th>Name</th>
                            <th>Month</th>
                            <th>My Purchase</th>
                            <th>Total Purchase</th>
                            <th>Total Incentive</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user, userIndex) =>
                                user.businessPrices.map((price, priceIndex) => (
                                    <tr key={`${user._id}-${price.month}`}>
                                        <td>{userIndex + 1}</td>
                                        <td>{user.name}</td>
                                        <td>{price.month}</td>
                                        <td>{price.myPurchase}</td>
                                        <td>{price.totalPurchase}</td>
                                        <td>{price.totalIncentive}</td>
                                        <td>
                                            <select
                                                className="border p-1 rounded"
                                                value={price.status}
                                                onChange={(e) =>
                                                    updateUserStatus(user._id, price.month, e.target.value)
                                                }
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="paid">Paid</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            )
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center">No data available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Financial;
