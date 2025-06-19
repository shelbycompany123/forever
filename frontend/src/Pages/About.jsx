import React from 'react'
import Title from '../Component/Title'
import { assets } from '../assets/assets'
import NewletterBox from '../Component/NewletterBox'

const About = () => {
  return (
    <div className="container mx-auto px-4 border-t pt-10">
      {/* Title */}
      <div className="text-center text-2xl mb-10">
        <Title text1="ABOUT" text2="US" />
      </div>

      {/* About Content */}
      <div className="flex flex-col md:flex-row items-center gap-12 mb-16">
        {/* Image */}
        <img 
          src={assets.about_img} 
          alt="About Us" 
          className="w-full md:max-w-md rounded-lg shadow-lg"
        />

        {/* Text */}
        <div className="flex flex-col gap-6 text-gray-600 md:w-1/2">
          <p>
            Forever was born out of a passion for innovation and a desire to revolutionize the way people shop online. 
            Our journey began with a simple idea: to provide a platform where customers can easily discover, explore, 
            and purchase a wide range of products from the comfort of their homes.
          </p>
          <p>
            With a commitment to quality, customer satisfaction, and continuous improvement, 
            Forever is more than just a store — it's a community. 
            We strive to bring you the best products, curated carefully to meet your evolving needs and style.
          </p>
          <p>
            Our mission is to make shopping a joyful and seamless experience for everyone.
          </p>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="text-center text-4xl mb-10">
        <Title text1="WHY" text2="CHOOSE US" />
      </div>

      <div className="flex flex-col md:flex-row gap-8 mb-20 text-sm">
        {/* Quality Assurance */}
        <div className="border rounded-lg p-8 flex flex-col gap-4 flex-1">
          <b>Quality Assurance:</b>
          <p className="text-gray-600">
            We meticulously select and vet each product to ensure it meets our stringent quality standards.
          </p>
        </div>

        {/* Convenience */}
        <div className="border rounded-lg p-8 flex flex-col gap-4 flex-1">
          <b>Convenience:</b>
          <p className="text-gray-600">
            With our user-friendly interface and hassle-free ordering process, shopping has never been easier.
          </p>
        </div>

        {/* Exceptional Customer Service */}
        <div className="border rounded-lg p-8 flex flex-col gap-4 flex-1">
          <b>Exceptional Customer Service:</b>
          <p className="text-gray-600">
            Our team of dedicated professionals is here to assist you every step of the way, ensuring your satisfaction is our top priority.
          </p>
        </div>
      </div>

      {/* Newsletter */}
      <NewletterBox />
    </div>
  )
}

export default About
