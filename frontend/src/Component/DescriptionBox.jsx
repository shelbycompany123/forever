import React from 'react'

const DescriptionBox = () => {
  return (
    <div className="mt-20 mx-auto">
        {/* Tabs */}
        <ul className="flex border-b">
            <li className="text-gray-800 font-semibold text-sm bg-gray-100 py-3 px-8 border-b-2 border-gray-800 cursor-pointer transition-all hover:bg-gray-200">
            Description
            </li>
            <li className="text-gray-500 font-semibold text-sm py-3 px-8 cursor-pointer transition-all hover:bg-gray-100 hover:text-gray-800">
            Reviews
            </li>
        </ul>

        <div className='border px-6 py-6'>
            {/* Nội dung */}
            <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-800">Product Description</h3>
                <p className="text-sm text-gray-600 mt-4 leading-relaxed">
                Elevate your casual style with our premium men's t-shirt. Crafted for comfort and designed with a modern fit, this versatile shirt is an essential addition to your wardrobe. The soft and breathable fabric ensures all-day comfort, making it perfect for everyday wear. Its classic crew neck and short sleeves offer a timeless look.
                </p>
            </div>

            {/* Danh sách đặc điểm */}
            <ul className="space-y-3 list-disc list-inside mt-6 text-sm text-gray-600">
                <li>A gray t-shirt is a wardrobe essential because it is so versatile.</li>
                <li>Available in a wide range of sizes, from extra small to extra large, and even in tall and petite sizes.</li>
                <li>This is easy to care for. They can usually be machine-washed and dried on low heat.</li>
                <li>You can add your own designs, paintings, or embroidery to make it your own.</li>
            </ul>
        </div>
        
    </div>

  )
}

export default DescriptionBox