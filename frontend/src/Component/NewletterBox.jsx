import React from 'react'

const NewletterBox = () => {

    const onSubmitHandler = (event) => {
        event.preventDefault();
    }

  return (
    <div className='flex flex-col items-center text-center'>
        <p className='text-2xl font-medium text-gray-800'>Subscribe now & het 20% Off</p>
        <p className='text-gray-400 mt-3'>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</p>
        <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3mx-auto my-6 border pl-3'>
            <input className='w-full sm:flex-1 outline-none' type="email" placeholder='Enter your email' />
            <button className='bg-black text-white text-xs px-10 py-4' type='submit'>Enter</button>
        </form>
    </div>
  )
}

export default NewletterBox