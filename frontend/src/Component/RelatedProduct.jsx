import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../Context/ShopContext'
import Title from "../Component/Title"
import Item from "./Item"

const RelatedProduct = ({category, subCategory}) => {

    const {product_list} = useContext(ShopContext);
    const [related, setRelated] = useState([]);

    useEffect(() => {

        if (product_list.length > 0) {
            let productsCopy = product_list.slice();
            productsCopy = productsCopy.filter((item) => category === item.category);
            productsCopy = productsCopy.filter((item) => subCategory === item.subCategory);

            setRelated(productsCopy.slice(0,5));
        }

    }, [product_list])

  return (
    <div className='my-24'>
      <div className='text-center text-3xl py-2'>
        <Title text1={'RELATED'} text2={'PRODUCTS'}/>
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {related.map((item, index) => {
          return (
            <Item 
              key={index}
              id={item._id}
              name={item.name}
              new_price={item.new_price}
              old_price={item.old_price}
              image={item.image}
            />
          )
        })}
      </div>
    </div>
  )
}

export default RelatedProduct