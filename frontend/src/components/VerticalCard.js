import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import displayINRCurrency from '../helpers/displayCurrency';
import addToCart from '../helpers/addToCart';
import Context from '../context/index';

const VerticalCard = ({ loading, data = [] }) => {
    const loadingList = new Array(13).fill(null);
    const { authToken } = useContext(Context);

    const handleAddToCart = async (e, id) => {
        e.stopPropagation();
        const isLoggedIn = !!authToken;
        if (isLoggedIn) {
            await addToCart(e, id, authToken);
        } else {
            const localCart = JSON.parse(localStorage.getItem("guestCart")) || [];
            const isProductInCart = localCart.some(item => item.productId === id);
    
            if (isProductInCart) {
                alert("Product already exists in cart");
            } else {
                localCart.push({ productId: id, quantity: 1 });
                localStorage.setItem("guestCart", JSON.stringify(localCart));
                alert("Product added to cart");
            }
        }
    };
    
    const calculateDiscount = (price, sellingPrice) => {
        if (price && sellingPrice) {
            return Math.round(((price - sellingPrice) / price) * 100);
        }
        return 0;
    };

    const availableProducts = data.filter(product => product.quantity > 0);
    const outOfStockProducts = data.filter(product => product.quantity === 0);

    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 justify-center md:justify-between overflow-x-auto transition-all ">
            {loading ? (
                loadingList.map((_, index) => (
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
                [...availableProducts, ...outOfStockProducts].map((product, index) => {
                    const discount = calculateDiscount(product?.price, product?.sellingPrice);
                    return (
                        <Link
                            key={index}
                            to={`/product/${product?._id}`}
                            className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ${product.quantity === 0 ? 'opacity-50' : ''}`}
                            style={{ minWidth: '160px', maxWidth: '180px' }}
                        >
                            <div className="relative bg-slate-100 h-36 p-4 flex justify-center items-center">
                                <img
                                    src={product.productImage[0]}
                                    className="object-contain h-full w-full transition-transform duration-300 hover:scale-105"
                                    alt={product?.productName}
                                />
                                {discount > 0 && (
                                    <span className="absolute top-2 left-2 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-lg">
                                        {discount}% OFF
                                    </span>
                                )}
                                {product.quantity === 0 && (
                                    <span className="absolute top-2 right-2 bg-red-200 text-red-700 text-xs px-2 py-1 rounded-lg">
                                        Out of Stock
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
                                    <p className="text-red-400 text-xs line-through">
                                        {displayINRCurrency(product?.price)}
                                    </p>
                                </div>
                                <div className="flex justify-center pt-2">
                                    {product?.quantity > 0 ? (
                                        <button
                                            className="bg-white text-black text-xs font-bold border-2 border-black-200 px-3 py-1 rounded-full transition-colors duration-300 hover:bg-green-100 hover:text-green-600"
                                            onClick={(e) => handleAddToCart(e, product?._id)}
                                        >
                                            Add
                                        </button>
                                    ) : (
                                        <span className="text-xs text-red-500 bg-red-100 px-3 py-1 rounded-full border border-red-500 font-semibold">
                                            Sold Out
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    );
                })
            )}
        </div>
    );
};

export default VerticalCard;