import React from 'react'
import {  Route, Routes } from 'react-router-dom';

import ColorClash from '../ColorClash';
import { GuestLayout } from '../layouts/GuestLayout';



const Router = () => {
  return (

    <Routes>
      <Route path='/' element={<GuestLayout />}>

        <Route path='start' element={<ColorClash />} />


      </Route>
      
    </Routes>

  );
};

export default Router