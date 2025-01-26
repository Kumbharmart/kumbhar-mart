import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import 'swiper/css/effect-coverflow';
import { Pagination, Autoplay } from 'swiper/modules';
import SummaryApi from '../common';
import Loader from './Loader';

const BannerProduct = () => {
    const [bannerImages, setBannerImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(SummaryApi.allBanner.url)
            .then((response) => response.json())
            .then((data) => {
                if (data.success && data.data) {
                    const bannersArray = Object.values(data.data);
                    setBannerImages(bannersArray);
                } else {
                    console.error('Unexpected data format:', data);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching banner images:', error);
                setLoading(false);
            });
    }, []);

    return (
        <div className="container mx-auto rounded relative">
            <div className="h-56 md:h-72 w-full relative">
                {loading ? (
                    <Loader />
                ) : (
                    <>
                        {/* Desktop and tablet version */}
                        <div className="hidden md:block h-full w-full relative">
                            <Swiper
                                slidesPerView={3}
                                spaceBetween={20}
                                loop={true}
                                pagination={{ clickable: true }}
                                autoplay={{ delay: 3000, disableOnInteraction: false }}
                                modules={[Pagination, Autoplay]}
                                className="h-full w-full"
                                effect="coverflow"
                            >
                                {bannerImages.map((banner, index) => (
                                    <SwiperSlide
                                        key={banner._id || index}
                                        className="flex justify-center items-center"
                                    >
                                        <img
                                            src={banner.imageUrl}
                                            className="w-full h-full object-contain rounded-md"
                                            alt={`Banner ${index}`}
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>

                        {/* Mobile version */}
                        <div className="md:hidden h-full w-full relative">
                            <Swiper
                                slidesPerView={1}
                                spaceBetween={10}
                                loop={true}
                                pagination={{ clickable: true }}
                                autoplay={{ delay: 3000, disableOnInteraction: false }}
                                modules={[Pagination, Autoplay]}
                                className="h-full"
                            >
                                {bannerImages.map((banner, index) => (
                                    <SwiperSlide
                                        key={banner._id || index}
                                        className="flex justify-center items-center"
                                    >
                                        <img
                                            src={banner.imageUrl}
                                            className="w-full h-full object-contain rounded-md"
                                            alt={`Banner ${index}`}
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default BannerProduct;
