import React, { useContext } from 'react'
import { Routes , Route, Navigate, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';


import Home from './Pages/Home'
import Result from './Pages/Result'
import BuyCredit from './Pages/BuyCredit'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import Login from './Components/Login'
import { AppContext } from './Context/AppContext'

const App = () => {
  const navigate=useNavigate();

  const {showLogin,user}=useContext(AppContext);

  return (
    <div className='px-4 sm:px-10 md:px-14 lg:px-28 min-h-screen bg-gradient-to-b from-teal-50 to-orange-50'>
        <ToastContainer position='bottom-right'/>
        <Navbar/>
        {showLogin && <Login/>}
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/result' element={user===null ? navigate('/') : <Result/>}/>
            <Route path='/buy' element={<BuyCredit/>}/>
        </Routes>
        <Footer/>
    </div>
  )
}

export default App
