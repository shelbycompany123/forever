import React from 'react'
import Title from '../Component/Title'
import { assets } from '../assets/assets'
import NewletterBox from '../Component/NewletterBox'

const Contact = () => {
  return (
    <div className="container mx-auto px-4 border-t pt-10">
      {/* Title */}
      <div className="text-center text-4xl font-bold mb-12">
        <Title text1="CONTACT" text2="US" />
      </div>

      {/* Contact Content */}
      <div className="flex flex-col md:flex-row gap-16 mb-28 items-center justify-center">
        {/* Image */}
        <img 
          src={assets.contact_img} 
          alt="Contact Us" 
          className="w-full md:max-w-md rounded-lg shadow-lg"
        />

        {/* Info */}
        <div className="flex flex-col gap-8 text-gray-600 text-lg md:w-1/2">
          <div>
            <p className="font-semibold text-2xl mb-2">Our Store</p>
            <p className="text-gray-500">
              57849 Wollms Station <br />
              Suite 350, Washington, USA
            </p>
          </div>

          <div>
            <p className="text-gray-500">
              Tel: 0978677395 <br />
              Email: yisep2369@gmail.com
            </p>
          </div>

          <div>
            <p className="font-semibold text-2xl mb-2">Careers at Forever</p>
            <p className="text-gray-500 mb-4">
              Learn more about our teams and job openings.
            </p>
            <button className="border border-black px-8 py-4 text-base font-semibold hover:bg-black hover:text-white transition-all duration-300">
              View Careers
            </button>
          </div>
        </div>
      </div>
      <NewletterBox />
    </div>
  )
}

export default Contact
