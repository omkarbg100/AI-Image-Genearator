import React, { useState, createContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios'
import {  useNavigate } from 'react-router-dom'


const Url=import.meta.env.VITR_BACKEND_URL || 'http://localhost:3000';

// Create the context
export const AppContext = createContext();

// Create the context provider component
const AppContextProvider = (props) => {
  const [user, SetUser] = useState(false);
  const [showLogin,setShowLogin]=useState(false);
  const backendUrl = Url;
  const [token,setToken]=useState(localStorage.getItem('token'))
  const [credit,setCredit]=useState(false)


  const navigate=useNavigate();

  const Logout=()=>{
    localStorage.removeItem('token');
    setToken('');
    SetUser(null)
  }

  const LoadCreditsData =async ()=>{
    try {
      const {data}=await axios.get(backendUrl + "/api/user/credits" , {
        headers:{token}})

      console.log(data);
      
      if(data.success){
        setCredit(data.credits);
        SetUser(data.user);
      }
      else{
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  const generateImage = async (prompt) =>{
    try{
      const {data}= await axios.post(backendUrl + '/api/image/generate-image',
        {prompt}, {headers:{token}})

      if(data.success){
        LoadCreditsData();
        return data.resultImage
      }
      else{
        toast.error(data.message);
        LoadCreditsData();
        if(data.creditBalance==0){
          navigate('/buy');
        }
      }
    }
    catch (error){
      console.log(error);
      toast.error(error.message);
    }
  }


  useEffect(()=>{
    if(token){
      LoadCreditsData();
    }
  },[token])


  const value = {
    user,
    SetUser,
    showLogin,
    setShowLogin,
    backendUrl,
    token,setToken,
    credit,setCredit,
    LoadCreditsData,Logout,generateImage
  };

  // 🟢 FIX: Use AppContext.Provider here, not AppContextProvider
  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;

