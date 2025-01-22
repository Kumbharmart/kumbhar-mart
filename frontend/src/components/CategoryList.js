import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';
import { Link } from 'react-router-dom';
import productCategory from '../helpers/productCategory'; // Assuming productCategory is an array with subcategories for each category
import personalCareImage from "../assest/products/Personalcare/personalcare.jpeg";
import cookingEssentialImage from "../assest/products/cooking/cooking.jpeg";
import defaultCategoryImage from "../assest/products/Personalcare/personalcare.jpeg"; // Fallback image

const CategoryList = () => {

    const categoryImages = {
        "personal care": personalCareImage,
        "cooking essential": cookingEssentialImage,
        // Add more categories as needed
    };
    
    const [categoryProduct, setCategoryProduct] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);

    const categoryLoading = new Array(13).fill(null);

    const fetchCategoryProduct = async () => {
        setLoading(true);
        try {
            const response = await fetch(SummaryApi.categoryProduct.url);
            const dataResponse = await response.json();
            let products = Array.isArray(dataResponse.data) ? dataResponse.data : [];
            
            // Move 'cooking essentials' category to the first position
            products = products.sort((a, b) => {
                const cookingPriority = 'cooking essential';
                const personalCarePriority = 'personal care';

                if (a.category.toLowerCase() === cookingPriority) return -1;
                if (b.category.toLowerCase() === cookingPriority) return 1; 

                if (a.category.toLowerCase() === personalCarePriority) return 1;
                if (b.category.toLowerCase() === personalCarePriority) return -1;

                return 0;
            });
            
            setCategoryProduct(products);
        } catch (error) {
            console.error("Failed to fetch category products:", error);
            setCategoryProduct([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategoryProduct();
    }, []);

    const getSubcategories = (category) => {
        const categoryData = productCategory.find(
            (cat) => cat.value.toLowerCase() === category?.toLowerCase()
        );
        return categoryData ? categoryData.subcategories : [];
    };

    const handleMouseEnter = (event, category) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const dropdownWidth = 256;
        const dropdownHeight = 256;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let top = rect.bottom + window.scrollY;
        let left = rect.left + window.scrollX;

        if (left + dropdownWidth > viewportWidth) {
            left = viewportWidth - dropdownWidth;
        }
        if (top + dropdownHeight > viewportHeight) {
            top = rect.top + window.scrollY - dropdownHeight;
        }

        setDropdownPosition({ top, left });
        setHoveredCategory(category);
        setIsDropdownVisible(true);
    };

    const handleMouseLeave = () => {
        setTimeout(() => {
            if (!dropdownElementHovered && !categoryElementHovered) {
                setIsDropdownVisible(false);
                setHoveredCategory(null);
            }
        }, 100);
    };

    let dropdownElementHovered = false;
    let categoryElementHovered = false;

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY) {
                setIsDropdownVisible(false);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.category-item') && !event.target.closest('.dropdown-item')) {
                setIsDropdownVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="container pt-5 pb-8">
            <div className="flex items-center gap-4 justify-between overflow-x-auto bg-white p-6 rounded-lg shadow-lg">
                {loading ? (
                    categoryLoading.map((_, index) => (
                        <div
                            className="h-16 w-16 md:w-20 md:h-20 rounded-full bg-slate-200 animate-pulse"
                            key={"categoryLoading" + index}
                        ></div>
                    ))
                ) : (
                    categoryProduct.map((product) => (
                        <div
                            key={product?.category || product?._id}
                            className="relative group category-item"
                            onMouseEnter={(e) => { handleMouseEnter(e, product?.category); categoryElementHovered = true; }}
                            onMouseLeave={() => { categoryElementHovered = false; handleMouseLeave(); }}
                        >
                            <Link
                                to={"/product-category?category=" + product?.category}
                                className="cursor-pointer"
                            >
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center">
                                        <img
                                            src={categoryImages[product?.category.toLowerCase()] || defaultCategoryImage}
                                            alt={product?.productName || "Product Image"}
                                            className="h-full object-scale-down hover:scale-125 transition-transform"
                                        />
                                    </div>
                                    <p className="text-center text-sm md:text-base capitalize mt-2">
                                        {product?.category}
                                    </p>
                                </div>
                            </Link>
                        </div>
                    ))
                )}
            </div>

            {isDropdownVisible && (
                <div
                    className="fixed z-50 bg-white shadow-lg p-4 rounded-lg w-48 border border-gray-300 overflow-y-auto max-h-64 mt-2 dropdown-item"
                    style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
                    onMouseEnter={() => { dropdownElementHovered = true; setIsDropdownVisible(true); }}
                    onMouseLeave={() => { dropdownElementHovered = false; handleMouseLeave(); }}
                >
                    {getSubcategories(hoveredCategory).length > 0 ? (
                        getSubcategories(hoveredCategory).map((subcategory) => (
                            <Link
                                key={subcategory.id}
                                to={"/product-category?" + "subcategory=" + subcategory?.value}
                                className="block px-4 py-2 text-sm hover:bg-gray-200"
                            >
                                {subcategory.label}
                            </Link>
                        ))
                    ) : (
                        <p className="text-center text-sm text-gray-500">No subcategories</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default CategoryList;
