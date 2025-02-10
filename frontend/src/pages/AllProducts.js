import React, { useEffect, useState } from 'react';
import UploadProduct from '../components/UploadProduct';
import SummaryApi from '../common';
import AdminProductCard from '../components/AdminProductCard';
import Loader from '../components/Loader';
import productCategory from '../helpers/productCategory'; 
import { useSeller } from "../context/SellerContext";

const AllProducts = () => {
  const [openUploadProduct, setOpenUploadProduct] = useState(false);
  const [allProduct, setAllProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;
  const maxVisiblePages = 10;
  const { seller } = useSeller();

  const fetchAllProduct = async () => {
    setLoading(true);
    try {
      const response = await fetch(SummaryApi.allProduct.url);
      const dataResponse = await response.json();
      setAllProduct(dataResponse?.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProduct();
  }, []);

  const filteredProducts = allProduct.filter(product => 
    (selectedCategory ? product.category === selectedCategory : true) &&
    (searchQuery ? product.productName?.toLowerCase().includes(searchQuery.toLowerCase()) : true)
  );
  
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const startPage = Math.floor((currentPage - 1) / maxVisiblePages) * maxVisiblePages + 1;
  const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

  return (
    <div>
      <div className='bg-white py-2 px-4 flex justify-between items-center'>
        <h2 className='font-bold text-lg'>All Product</h2>
        <input
          type='text'
          placeholder='Search product...'
          className='border px-3 py-1 rounded-full text-sm'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className='border-2 border-sky-600 text-sky-600 hover:bg-sky-600 hover:text-white transition-all py-1 px-3 rounded-full'
          onClick={() => setOpenUploadProduct(true)}
        >
          Upload Product
        </button>
      </div>


      <div className="py-4">
        <button
          className={`border-2 mx-2 px-3 py-1 rounded-full ${
            selectedCategory === '' ? 'bg-black text-white' : 'border-black text-black'
          }`}
          onClick={() => setSelectedCategory('')}
        >
          All Categories
        </button>
        <div className="grid grid-cols-10 gap-4 mt-4">
          {productCategory.map((category) => (
            <button
              key={category.id}
              className={`border-2 px-3 py-1 rounded-full ${
                selectedCategory === category.value ? 'bg-black text-white' : 'border-black text-black text-xs'
              }`}
              onClick={() => setSelectedCategory(category.value)}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>
      <div className='flex justify-center items-center py-4 space-x-2'>
        <button
          className='px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50'
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {[...Array(endPage - startPage + 1)].map((_, i) => {
          const pageNumber = startPage + i;
          return (
            <button
              key={pageNumber}
              className={`px-3 py-1 rounded ${
                currentPage === pageNumber ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          );
        })}
        <button
          className='px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50'
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
      <div className="py-4">
        {loading ? (
          <div className="flex justify-center items-center w-full h-full">
            <Loader />
          </div>
        ) : currentProducts.length > 0 ? (
          <div className="grid grid-cols-6 gap-5">
            {currentProducts.map((product, index) => (
              <AdminProductCard
                data={product}
                key={index + "allProduct"}
                fetchdata={fetchAllProduct}
              />
            ))}
          </div>
        ) : (
          <div className="w-full text-center text-gray-500">
            No products found.
          </div>
        )}
      </div>

      <div className='flex justify-center items-center py-4 space-x-2'>
        <button
          className='px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50'
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {[...Array(endPage - startPage + 1)].map((_, i) => {
          const pageNumber = startPage + i;
          return (
            <button
              key={pageNumber}
              className={`px-3 py-1 rounded ${
                currentPage === pageNumber ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          );
        })}
        <button
          className='px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50'
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {openUploadProduct && (
        <UploadProduct onClose={() => setOpenUploadProduct(false)} fetchData={fetchAllProduct} />
      )}
    </div>
  );
};

export default AllProducts;
