import React from 'react'
import { Routes, Route, NavLink } from 'react-router-dom';
import { Home } from './pages';
import Navbar from './components/Navbar';
import { Toaster } from "react-hot-toast";
import Footer from './components/Footer';

function App() {
  return (
    <>
    <Toaster />
    <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  )
}

export default App
