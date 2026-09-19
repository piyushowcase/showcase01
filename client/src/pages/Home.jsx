import React from "react";
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import bgImg from '../assets/mern-auth-assets/assets/bg_img.png'

const Home = () => {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <Navbar />
      <Header />
    </div>
  )
}

export default Home;