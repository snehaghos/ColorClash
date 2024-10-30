import React from 'react'
import Navbar from '../GuestInterface/components/Navbar'
import { Outlet } from 'react-router-dom'

// import Navbar from '../components/Frontend/Navbar'





export const GuestLayout = () => {
  return (
    <>
          <Navbar/>
            <Outlet/>
          

    </>
  )
}
