import React, { useContext, useEffect, useState } from 'react'
import Title from './Title'
import Item from './Item'
import { ShopContext } from '../Context/ShopContext'

const LatestCollection = () => {

    const {product_list} = useContext(ShopContext)
    const [latestProducts, setLatestProducts] = useState([]);

    useEffect(() => {
        setLatestProducts(product_list.slice(0,10))
    }, [product_list])

  return (
    <div className='my-10'>
        <div className="text-center py-8 text-3xl">
            <Title text1={'LATEST'} text2={'COLLECTIONS'} />
            <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </p>
        </div>
        
        {/* Products Rendering */}
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
            {latestProducts.map((item, index) => (
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

export default LatestCollection