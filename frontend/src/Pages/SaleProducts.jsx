// frontend/src/Pages/SaleProducts.jsx
import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../Context/ShopContext'
import Item from '../Component/Item'
import Title from '../Component/Title'

const SaleProducts = () => {
  const { product_list } = useContext(ShopContext);
  const [saleProducts, setSaleProducts] = useState([]);

  useEffect(() => {
    if (product_list && product_list.length > 0) {
      const filteredProducts = product_list.filter(item => item.sale === true); 
      setSaleProducts(filteredProducts);
    }
  }, [product_list]);

  return (
    <div>
      <div className='text-center py-8 text-3xl'>
        <Title text1={'SẢN PHẨM'} text2={'ĐANG SALE'} />
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
          Khám phá những sản phẩm đang có ưu đãi đặc biệt
        </p>
      </div>

      {/* Loading state */}
      {!product_list ? (
        <div className='text-center py-8'>
          <p>Đang tải sản phẩm...</p>
        </div>
      ) : saleProducts.length === 0 ? (
        <div className='text-center py-8'>
          <p>Hiện tại không có sản phẩm nào đang sale</p>
        </div>
      ) : (
        /* Render Products */
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
          {saleProducts.map((item, index) => (
            <Item 
              key={index} 
              id={item._id}
              name={item.name} 
              new_price={item.new_price} 
              old_price={item.old_price}
              image={item.image} 
              sale={item.sale}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default SaleProducts