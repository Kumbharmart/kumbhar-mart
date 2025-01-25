import React, { useContext, useEffect, useState } from 'react';
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct';
import displayINRCurrency from '../helpers/displayCurrency';
import { Link } from 'react-router-dom';
import addToCart from '../helpers/addToCart';
import Context from '../context/index';

const CategroyWiseProductDisplay = ({ category, heading }) => {
    const [data, setData] = useState([]); // Full product data
    const [visibleProducts, setVisibleProducts] = useState([]); // Products to show
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12; // Number of items to display per page

    const { authToken } = useContext(Context); // Get the authToken from Context
    const { fetchUserAddToCart } = useContext(Context);

    const handleAddToCart = async (e, id) => {
        e.stopPropagation();  // Stop event propagation to prevent Link navigation
        await addToCart(e, id, authToken);
        if (fetchUserAddToCart) {
            fetchUserAddToCart(); // Call fetchUserAddToCart after adding the product to the cart
        } else {
            console.error('fetchUserAddToCart is not available in context');
        }
    };

    const fetchData = async () => {
        setLoading(true);
        const categoryProduct = await fetchCategoryWiseProduct(category);
        setLoading(false);
        setData(categoryProduct?.data);
        setVisibleProducts(categoryProduct?.data.slice(0, itemsPerPage)); // Display first 12 items
    };

    useEffect(() => {
        fetchData();
    }, [category]);

    const handleNextPage = () => {
        const nextPage = currentPage + 1;
        const startIndex = (nextPage - 1) * itemsPerPage;
        const newVisibleProducts = data.slice(0, startIndex + itemsPerPage);

        setVisibleProducts(newVisibleProducts);
        setCurrentPage(nextPage);
    };

    // Calculate discount percentage
    const calculateDiscountPercentage = (originalPrice, sellingPrice) => {
        if (!originalPrice || !sellingPrice) return 0;
        const discount = ((originalPrice - sellingPrice) / originalPrice) * 100;
        return Math.round(discount);
    };

    return (
        <>
            <h2 className="text-2xl font-semibold py-4">{heading}</h2>

            <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 justify-center md:justify-between overflow-x-auto scrollbar-none transition-all'>
                {loading ? (
                    [...Array(12)].map((_, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-lg">
                            <div className="bg-slate-200 h-40 p-4 flex justify-center items-center animate-pulse"></div>
                            <div className="p-4 space-y-3">
                                <div className="h-4 bg-slate-200 rounded-full animate-pulse"></div>
                                <div className="h-4 bg-slate-200 rounded-full animate-pulse"></div>
                                <div className="h-4 bg-slate-200 rounded-full animate-pulse"></div>
                            </div>
                        </div>  
                    ))
                ) : (
                    visibleProducts.map((product, index) => (
                        <Link
                            key={index}
                            to={`/product/${product?._id}`}
                            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                            style={{ minWidth: '160px', maxWidth: '180px' }} // Adjust card width for smaller screens
                        >
                            <div className="relative bg-slate-100 h-36 p-4 flex justify-center items-center">
                                <img
                                    src={product.productImage[0]}
                                    className="object-contain h-full w-full transition-transform duration-300 hover:scale-105"
                                    alt={product?.productName}
                                />
                                {product?.price > product?.sellingPrice && (
                                    <span className="absolute top-2 left-2 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-lg">
                                        -{calculateDiscountPercentage(product.price, product.sellingPrice)}% OFF
                                    </span>
                                )}
                            </div>
                            <div className="p-3 space-y-2">
                                <h3 className="text-xs md:text-sm font-semibold text-gray-800 truncate">
                                    {product?.productName}
                                </h3>
                                <div className="flex items-center justify-between">
                                    <p className="text-green-700 text-sm font-semibold">
                                        {displayINRCurrency(product?.sellingPrice)}
                                    </p>
                                    <p className="text-slate-400 text-xs line-through">
                                        {displayINRCurrency(product?.price)}
                                    </p>
                                </div>
                                <div className="flex justify-center pt-2">
                                    {product?.quantity > 0 ? (
                                        <button
                                        className="bg-white text-black text-xs font-bold border-2 border-black-200 px-3 py-1 rounded-full w-full transition-colors duration-300 hover:bg-green-100 hover:text-green-600"
                                        onClick={(e) => handleAddToCart(e, product?._id)}
                                    >
                                        Add
                                    </button>
                                    
                                    ) : (
                                        <span className="text-xs text-red-500 bg-red-100 px-3 py-1 rounded-full border border-red-500 font-semibold">
                                            Out of Stock
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>

            {/* Load more button */}
            {visibleProducts.length < data.length && (
                <div className="flex justify-center mt-6">
                    <button
                        onClick={handleNextPage}
                        className="px-4 py-1 border border-sky-700 text-sky-700 rounded-full hover:bg-sky-500 hover:text-white"
                    >
                        Show More
                    </button>
                </div>
            )}
        </>
    );
};

export default CategroyWiseProductDisplay;