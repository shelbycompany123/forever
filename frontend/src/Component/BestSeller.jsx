import React, { useContext, useEffect, useState } from 'react'
import Title from './Title'
import Item from './Item'
import { ShopContext } from '../Context/ShopContext'

const BestSeller = () => {

    const {product_list} = useContext(ShopContext);
    const bestSeller =product_list.filter(product=> product.bestseller)


  return (
    <div className='my-10'>
        <div className="text-center py-8 text-3xl">
            <Title text1={'BEST'} text2={'SELLERS'} />
            <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </p>
        </div>
        
        {/* Products Rendering */}
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
            {bestSeller.map((item, index) => (
                <Item
                key={index}
                id={item._id}
                name={item.name}
                image={item.image}
                new_price={item.new_price}
                old_price={item.old_price}
                />
            ))}
        </div>
        
    </div>
  )
}

export default BestSeller