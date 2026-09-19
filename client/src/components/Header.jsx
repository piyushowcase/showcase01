import React, { useContext } from 'react'
import { assets } from '../assets/mern-auth-assets/assets/assets.js'
import handWave from '../assets/mern-auth-assets/assets/hand_wave.png'
import { AppContent } from '../context/AppContext.jsx'

const Header = () => {
  const { userData } = useContext(AppContent)

  return (
    <div className='flex min-h-screen flex-col items-center justify-center px-4 text-center text-gray-800'>
      <img src={assets.header_img} alt='' className='mb-6 h-36 w-36 rounded-full' />
      <h1 className='mb-2 flex items-center gap-2 text-xl font-medium sm:text-3xl'>
        <img src={handWave} alt='' className='h-8 w-8' />
        Hey {userData ? userData.name : 'Developer'}!
      </h1>
      <h2 className='mb-4 text-3xl font-semibold sm:text-5xl'>Welcome to the app</h2>
      <p className='mb-8 max-w-md'>Let&apos;s start a quick product tour and get you up and running in no time.</p>
      <button type='button' className='rounded-full border border-gray-500 px-8 py-2.5 transition-all hover:bg-gray-100'>
        Get Started
      </button>
    </div>
  )
}

export default Header
