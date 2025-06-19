import React, { useContext } from 'react'
import { ShopContext } from '../Context/ShopContext'
import Title from "../Component/Title"

const CartTotal = () => {

  const{delivery_fee, getCartAmount, formatCurrency} = useContext(ShopContext)
      
  return (
    <div className='w-full'>
      <div className='text-2xl'>
        <Title text1={'CART'} text2={'TOTALS'} />
      </div>

      <div className='flex flex-col gap-2 mt-2 text-sm'>
        <div className='flex justify-between'>
            <p>Subtotal</p>
            <p>{formatCurrency(getCartAmount())}</p>
        </div>
        <hr />
        <div className='flex justify-between'>
            <p>Shipping Fee</p>
            <p>{formatCurrency(delivery_fee)}</p>
        </div>
        <hr />
        <div className='flex justify-between'>
            <b>Total</b>
            <b>{formatCurrency(getCartAmount() === 0 ? 0 : getCartAmount() + delivery_fee)}</b>
        </div>
      </div>

    </div>
  )
}

export default CartTotal