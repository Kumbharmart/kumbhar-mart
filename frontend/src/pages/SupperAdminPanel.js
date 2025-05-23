import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaRegCircleUser } from "react-icons/fa6";
import { Link, Outlet, useNavigate } from 'react-router-dom';
import ROLE from '../common/role';

const SuperAdminPanel = () => {
    const user = useSelector(state => state?.user?.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.role !== ROLE.SUPER_ADMIN) {
            navigate("/");
        }
    }, [user, navigate]);

    return (
        <div className='min-h-[calc(100vh-120px)] md:flex'>
            <aside className='bg-white min-h-full w-full max-w-60 customShadow'>
                <div className='h-32 flex justify-center items-center flex-col'>
                    <div className='text-5xl cursor-pointer relative flex justify-center'>
                        {user?.profilePic ? (
                            <img src={user?.profilePic} className='w-20 h-20 rounded-full' alt={user?.name} />
                        ) : (
                            <FaRegCircleUser />
                        )}
                    </div>
                    <p className='capitalize text-lg font-semibold'>{user?.name}</p>
                    <p className='text-sm'>{user?.role}</p>
                </div>

                {/*** Super Admin navigation */}
                <div>
                    <nav className='grid p-4'>
                        <Link to={"dashboard"} className='px-2 py-1 hover:bg-slate-100'>Dashboard</Link>
                        <Link to={"all-users"} className='px-2 py-1 hover:bg-slate-100'>User List</Link>
                        <Link to={"order-list"} className='px-2 py-1 hover:bg-slate-100'>Order List</Link>
                        <Link to={"all-products"} className='px-2 py-1 hover:bg-slate-100'>Product List</Link>
                        <Link to={"all-banners"} className='px-2 py-1 hover:bg-slate-100'>Banner List</Link> 
                        <Link to={"all-adbanners"} className='px-2 py-1 hover:bg-slate-100'>Ad Banner List</Link> 
                        <Link to={"all-kyc"} className='px-2 py-1 hover:bg-slate-100'>KYC List</Link>
                        <Link to={"financial"} className='px-2 py-1 hover:bg-slate-100'>Finance</Link>
                    </nav>
                </div>
            </aside>

            <main className='w-full h-full p-2'>
                <Outlet />
            </main>
        </div>
    );
}

export default SuperAdminPanel;
