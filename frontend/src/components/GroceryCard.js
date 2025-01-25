import React, { useContext, useEffect, useRef, useState } from 'react';
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct';
import displayINRCurrency from '../helpers/displayCurrency';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import { Link, useNavigate } from 'react-router-dom';
import addToCart from '../helpers/addToCart';
import Context from '../context/index';

const GroceryCart = ({ category, heading }) => {
    const { authToken } = useContext(Context);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const loadingList = new Array(15).fill(null);  // Show up to 15 products initially
    const scrollElement = useRef();
    const { fetchUserAddToCart } = useContext(Context);
    const navigate = useNavigate();

    // Handle Add to Cart
    const handleAddToCart = async (e, id) => {
        e.stopPropagation();
        await addToCart(e, id, authToken);
        fetchUserAddToCart && fetchUserAddToCart();
    };

    // Fetch limited data (15 products)
    const fetchData = async () => {
        setLoading(true);
        try {
            const categoryProduct = await fetchCategoryWiseProduct(category);
            setData(Array.isArray(categoryProduct?.data) ? categoryProduct.data.slice(0, 15) : []);
        } catch (error) {
            console.error('Failed to fetch category-wise products:', error);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [category]);

    // Scroll functionality
    const scrollRight = () => scrollElement.current.scrollLeft += 300;
    const scrollLeft = () => scrollElement.current.scrollLeft -= 300;

    // Navigate to the full grocery view
    const handleViewAll = () => navigate(`/product-category?category=${category}`);

    // Calculate percentage off
    const calculateDiscountPercentage = (price, sellingPrice) => {
        if (price > 0) {
            return Math.round(((price - sellingPrice) / price) * 100);
        }
        return 0;
    };

    return (
        <div className='container px-5 my-6 relative w-full'>
            <div className="flex justify-between items-center">
                <h2 className='text-2xl font-semibold py-4'>{heading}</h2>
                <button
                    className="font-bold py-2 rounded-md transition-transform duration-300 hover:scale-105 text-sky-800"
                    onClick={handleViewAll}
                >
                    View All
                </button>

            </div>

            {/* Scroll buttons */}

            {/* Products Slider */}
            <div
                ref={scrollElement}
                className='flex gap-5 overflow-x-auto scrollbar-none'
                style={{ scrollBehavior: 'smooth' }}
            >
            <button
                className='bg-white shadow-md rounded-full p-1 absolute top-1/2 transform -translate-y-1/2 text-lg md:flex justify-center items-center z-10'
                onClick={scrollLeft}
            >
                <FaAngleLeft />
            </button>
            <button
                className='bg-white shadow-md rounded-full p-1 absolute right-2 top-1/2 transform -translate-y-1/2 text-lg md:flex justify-center items-center z-10'
                onClick={scrollRight}
            >
                <FaAngleRight />
            </button>
                {loading ? (
                    loadingList.map((_, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-lg">
                            <div className="bg-slate-200 h-36 flex justify-center items-center animate-pulse"></div>
                            <div className="p-2 space-y-2">
                                <div className="h-4 bg-slate-200 rounded-full animate-pulse"></div>
                                <div className="h-4 bg-slate-200 rounded-full animate-pulse"></div>
                                <div className="h-4 bg-slate-200 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    ))
                ) : (
                    data.map((product, index) => (
                        <Link
                            key={index}
                            to={`/product/${product?._id}`}
                            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                            style={{ minWidth: '170px', maxWidth: '170px' }}
                        >
                            <div className="h-28 px-2 pt-2 flex justify-center items-center">
                                <img
                                    src={product.productImage[0]}
                                    className="object-contain h-full w-full transition-transform duration-300 hover:scale-105"
                                    alt={product?.productName}
                                />
                            </div>
                            <div className="px-4 py-5 h-30 space-y-1">
                                <h3 className="text-xs md:text-sm font-semibold text-gray-800 truncate">
                                    {product?.productName}
                                </h3>
                                <div className="flex items-center justify-between pb-1">
                                    <p className="text-gray-800 text-base font-semibold">
                                        {displayINRCurrency(product?.sellingPrice)}
                                    </p>
                                    <p className="text-slate-400 text-xs line-through">
                                        {displayINRCurrency(product?.price)}
                                    </p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-green-600 font-semibold bg-green-100 px-2 py-1 rounded">
                                        {calculateDiscountPercentage(product?.price, product?.sellingPrice)}% Off
                                    </span>
                                    <div className="flex justify-center">
                                        {/* Removed stock checking */}
                                        <button
                                            className="bg-white text-gray-800 text-xs font-bold border-2 border-black-200 px-3 py-1 rounded-full transition-colors duration-300 hover:bg-blue-100"
                                            onClick={(e) => handleAddToCart(e, product?._id)}
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
};

export default GroceryCart;