import React from 'react'
import CategoryList from '../components/CategoryList'
import BannerProduct from '../components/BannerProduct'
import HorizontalCardProduct from '../components/HorizontalCardProduct'
import VerticalCardProduct from '../components/VerticalCardProduct'
import AdBanner from '../components/AdBannerProduct'
import GroceryCart from '../components/GroceryCard'
import Offer from '../components/Offer'
import { Link } from 'react-router-dom'
import SaleBanner from '../components/Time'
import CardPage from '../components/Cards'
import Column from '../components/ColoumnCategory'

const Home = () => {
  return (
    <div className='px-6 mt-5 flex justify-center items-center flex-col'>
      <CategoryList/>
      <BannerProduct/>
      <Link to={"/refer"}><AdBanner/></Link>
      {/* <GroceryCart category={"personal care"} heading={"Personal Care"}/> */}
      {/* <Offer/>
      <SaleBanner/>
      <CardPage/> */}

     {/* <GroceryCart category={"cooking essential"} heading={"Cooking Essential"}/>
      <GroceryCart category={"fruits"} heading={"Fruits & Vegetables"}/> */}
     <Column category={"cooking essential"} heading={"cooking essential"}/>
       {/* <Column category={"home decor"} heading={"Home Decor"}/>
      <Column category={"gifts, hampers"} heading={"Gifts, Hampers"}/>
      <Column category={"beauty"} heading={"Beauty"}/>
      <Column category={"stationary"} heading={"Stationary"}/> */}
      {/* <GroceryCart category={"home care"} heading={"Home Care"}/> */}
      
    </div>
  )
}

export default Home