import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../Context/ShopContext'
import SaleTag from './SaleTag';

const Item = (props) => {

  const {formatCurrency} = useContext(ShopContext);

  return (
    <Link to={`/product/${props.id}`} className="text-gray-700 cursor-pointer">
        <div className="overflow-hidden relative">
            <SaleTag oldPrice={props.old_price} newPrice={props.new_price} isSale={props.sale} />
            <img
            className="w-full h-auto transition-transform duration-300 ease-in-out hover:scale-110"
            src={props.image[0]}
            alt={props.name}
            />
        </div>
        <p className="pt-3 pb-1 text-sm truncate">{props.name}</p>
        <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-black">{formatCurrency(props.new_price)}</p>
            <p className="text-sm font-medium line-through text-gray-400">{formatCurrency(props.old_price)}</p>
        </div>
    </Link>
  )
}

export default Item