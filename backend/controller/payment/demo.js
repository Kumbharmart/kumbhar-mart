import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import moment from 'moment';
import { MdModeEdit, MdDelete } from "react-icons/md";
import ChangeUserRole from '../components/ChangeUserRole';
import * as XLSX from 'xlsx'; // For exporting to Excel
import Loader from '../components/Loader';

const AllUsers = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openUpdateRole, setOpenUpdateRole] = useState(false);
    const [updateUserDetails, setUpdateUserDetails] = useState({
        name: "",
        role: "",
        phone: "",
        password: "",
        _id: ""
    });

    // Fetch all users from API
    const fetchAllUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch(SummaryApi.allUser.url, {
                method: SummaryApi.allUser.method,
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                setAllUsers(data.data);
            } else {
                toast.error('Failed to fetch users');
            }
        } catch (error) {
            toast.error('Error fetching users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllUsers();
    }, []);

    // Delete User
    const deleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const response = await fetch(`/api/delete-user/${userId}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });
                const data = await response.json();
                if (data.success) {
                    toast.success('User deleted successfully');
                    fetchAllUsers();
                } else {
                    toast.error('Failed to delete user');
                }
            } catch (error) {
                toast.error('Error deleting user');
            }
        }
    };

    // Export User Data to Excel
    const exportToExcel = (users) => {
        const worksheet = users.map((user, index) => ({
            'Sr. No.': index + 1,
            'Name': user.name || 'No name',
            'Phone': user.mobileNo || 'No phone',
            'Role': user.role || 'No role',
            'Hashed Password': user.password || 'No password',
            'Created Date': moment(user.createdAt).format('LL') || 'No date',
        }));

        const ws = XLSX.utils.json_to_sheet(worksheet);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Users");
        XLSX.writeFile(wb, "user_list.xlsx");
    };

    return (
        <div className='bg-white p-4 rounded shadow-md'>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">All Users</h2>
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600"
                    onClick={() => exportToExcel(allUsers)}
                >
                    Export to Excel
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center w-full h-64">
                    <Loader />
                </div>
            ) : (
                <table className='w-full border-collapse'>
                    <thead>
                        <tr className='bg-gray-800 text-white'>
                            <th>Sr.</th>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Role</th>
                            <th>Hashed Password</th>
                            <th>Created Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allUsers.map((user, index) => (
                            <tr key={user._id} className='text-center border-b'>
                                <td>{index + 1}</td>
                                <td>{user?.name}</td>
                                <td>{user?.mobileNo || 'No phone'}</td>
                                <td>{user?.role}</td>
                                <td className='truncate w-48'>{user?.password || 'No password'}</td>
                                <td>{moment(user?.createdAt).format('LL')}</td>
                                <td>
                                    <button 
                                        className='bg-green-100 p-2 rounded-full cursor-pointer hover:bg-green-500 hover:text-white' 
                                        onClick={() => {
                                            setUpdateUserDetails(user);
                                            setOpenUpdateRole(true);
                                        }}
                                    >
                                        <MdModeEdit />
                                    </button>
                                    <button 
                                        className='bg-red-100 p-2 rounded-full cursor-pointer hover:bg-red-500 hover:text-white ml-2'
                                        onClick={() => deleteUser(user._id)}
                                    >
                                        <MdDelete />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {openUpdateRole && (
                <ChangeUserRole 
                    onClose={() => setOpenUpdateRole(false)} 
                    name={updateUserDetails.name}
                    phone={updateUserDetails.phone}
                    role={updateUserDetails.role}
                    userId={updateUserDetails._id}
                    callFunc={fetchAllUsers}
                />
            )}
        </div>
    );
};

export default AllUsers;
