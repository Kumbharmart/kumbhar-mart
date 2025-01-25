import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';
import { Link } from 'react-router-dom';
import personalCareImage from "../assest/CategoryImgs/Personal Care.png";
import cookingEssentialImage from "../assest/CategoryImgs/Cooking Essential.png";
import BeautyCareImage from "../assest/CategoryImgs/Beauty.png";
import BiscuitsDrinksPackagedFoodsImage from "../assest/CategoryImgs/Biscuits, Drinks & Packaged Foods.png";
import DairyBakeryImage from "../assest/CategoryImgs/Dairy & Bakery.png";
import DisposablesImage from "../assest/CategoryImgs/Disposables.png";
import FruitsVegetablesImage from "../assest/CategoryImgs/Fruits & Vegetables.png";
import  GiftsHampersImage from "../assest/CategoryImgs/Gifts & Hampers.png";
import HomeCareImage from "../assest/CategoryImgs/Home Care.png";
import MomBabyCareImage from "../assest/CategoryImgs/Mom & Baby Care.png";
import SchoolOfficeImage from "../assest/CategoryImgs/School, Office & Stationary.png";
import defaultCategoryImage from    "../assest/CategoryImgs/Personal Care.png";

const categoryImages = {
     "personal care": personalCareImage,
           "cooking essential": cookingEssentialImage,
           "beauty care": BeautyCareImage,
           "biscuits, drinks, packaged foods": BiscuitsDrinksPackagedFoodsImage,
           "dairy, bakery": DairyBakeryImage,
           "disposables": DisposablesImage,
           "fruits, vegetables": FruitsVegetablesImage,
           "gifts, hampers": GiftsHampersImage,
           "home care": HomeCareImage,
           "mom, baby care": MomBabyCareImage,
           "school, office, stationary": SchoolOfficeImage,
};

const CategoryList = () => {
    const [categoryProduct, setCategoryProduct] = useState([]);
    const [loading, setLoading] = useState(false);

    const categoryLoading = new Array(13).fill(null);

    const fetchCategoryProduct = async () => {
        setLoading(true);
        try {
            const response = await fetch(SummaryApi.categoryProduct.url);
            const dataResponse = await response.json();

            
            setCategoryProduct(Array.isArray(dataResponse.data) ? dataResponse.data : []);
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

    return (
        <div className='container mx-auto py-5 px-8'>
            <div className='flex items-center gap-4 justify-between overflow-scroll scrollbar-none'>
                    {loading ? (
                        categoryLoading.map((_, index) => (
                            <div
                                className='h-16 w-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-slate-200 animate-pulse'
                                key={"categoryLoading" + index}
                            ></div>
                        ))
                    ) : (
                        categoryProduct.map((product) => (
                            
                            <Link
                                to={"/product-category?category=" + product?.category}
                                
                                className='cursor-pointer'
                                key={product?.category || product?._id} // Use a unique key if possible
                            >
                                
                                <div className='w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden p-4 bg-slate-200 flex items-center justify-center'>
                                    <img
                                        src={categoryImages[product?.category.toLowerCase()] || categoryImages["default"]}
                                        alt={product?.productName || 'Product Image'} // More descriptive alt text
                                        className='h-full object-scale-down mix-blend-multiply hover:scale-125 transition-all'
                                    />
                                </div>
                                <p className='text-center text-sm md:text-base capitalize'>
                                    {product?.category}
                                </p>
                            </Link>
                        ))
                    )}
            </div>
        </div>
    );
};

export default CategoryList;
