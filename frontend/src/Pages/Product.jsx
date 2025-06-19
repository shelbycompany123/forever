import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../Context/ShopContext'
import { assets } from '../assets/assets';
import DescriptionBox from '../Component/DescriptionBox';
import RelatedProduct from '../Component/RelatedProduct';
import ProductComments from '../Component/ProductComment';

const Product = () => {

  const {productId} = useParams();
  const {product_list, addToCart} = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');

  const fetchProductData = async () => {
    product_list.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(item.image[0]);
        return null;
      }
    })
  }
  
  const formatCurrency = (amount) => {
    const formatted = amount.toLocaleString('vi-VN');
    return formatted.replace(/\./g, ',') + ' VNĐ';
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, product_list])


  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      {/* Product Data */}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
        {/* Product Images */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y justify-between sm:justify-normal sm:w-[18.7%] w-full'>
            {productData.image.map((item,index) => {
              return (
                <img onClick={() => setImage(item)} src={item} key={index} className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' alt="" />
              )
            })}
          </div>
          <div className='w-full sm:w-[80%]'>
            <img className='w-full h-auto' src={image} alt="" />
          </div>
        </div>

        {/* Product Infor */}
        <div className='flex-1'>
            <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
            <div className='flex items-center gap-1 mt-2'>
              <img src={assets.star_icon} alt="" className="w-3" />
              <img src={assets.star_icon} alt="" className="w-3" />
              <img src={assets.star_icon} alt="" className="w-3" />
              <img src={assets.star_icon} alt="" className="w-3" />
              <img src={assets.star_icon} alt="" className="w-3" />
              <p className='pl-2'>(122)</p>
            </div>
            <div className='flex gap-5'>
              <p className='mt-5 text-3xl font-medium'>{formatCurrency(productData.new_price)}</p>
              <p className='mt-5 text-3xl font-sm text-gray-400 line-through italic'>{formatCurrency(productData.old_price)}</p>
            </div>
            <p className='mt-5 text-gray-500 md:w-4/5 whitespace-pre-line'>{productData.description}</p>
            <div className='flex flex-col gap-4 my-8'>
                <p>Select Size</p>
                <div className='flex gap-2'>
                  {productData.sizes.map((item, index) => {
                    return (
                      <button onClick={() => setSize(item)} className={`border py-2 px-4 bg-gray-100 ${item === size ? 'border-orange-500' : ''}`} key={index}>{item}</button>
                    )
                  })}
                </div>
            </div>
            <button onClick={() => addToCart(productData._id, size)} className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700'>ADD TO CART</button>
            <hr className='mt-8 sm:w-4/5'/>
            <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
                <p>✦ 100% Original Product.</p>
                <p>✦ Cash on delivery is available on this product.</p>
                <p>✦ Easy return and exchange policy within 7 days.</p>
            </div>
        </div>
      </div>

      {/* Description & Review */}
      <DescriptionBox />

      {/* Product Comments */}
      <ProductComments productId={productData._id} />

      {/* Related Product */}
      <RelatedProduct category={productData.category} subCategory={productData.subCategory} />

    </div>
  ) : <div className='opacity-0'></div>
}

export default Product