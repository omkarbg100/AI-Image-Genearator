import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../Context/AppContext';
import { motion } from 'motion/react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {

    const [state, setState] = useState('Login');

    const { setShowLogin, backendUrl , setToken , SetUser,LoadCreditsData} = useContext(AppContext);

    const[name,SetName]=useState('')
    const[email,Setemail]=useState('')
    const[password,Setpassword]=useState('')


    const onSubmitHandler = async (e) =>{
        e.preventDefault();
        try {
            if(state=='Login'){
                const {data}=await axios.post(backendUrl + '/api/user/login',{"email": email, "password": password});
                if(data.success){
                    setToken(data.token);
                    SetUser(data.user)
                    localStorage.setItem('token',data.token);
                    setShowLogin(false)
                }
                else{
                    console.log(data.message);
                    toast.error(data.message);
                }

            }
            else{
                const {data}=await axios.post(backendUrl+'/api/user/register',{
                    name,email,password });
                if(data.success){
                    setToken(data.token);
                    SetUser(data.user)
                    localStorage.setItem('token',data.token);
                    setShowLogin(false);
                }
                else{
                    console.log(data.message);
                    toast.error(data.message);
                }
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }


    }

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'unset';
        }
    })

    return (
        <div className='fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>
            <motion.form

            onSubmit={onSubmitHandler}

                  
                initial={{ opacity: 0.2, y: 50 }}
                transition={{ duration: 0.3 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}

                className='relative bg-white p-10 rounded-xl text-slate-500'>
                <h1 className='text-center text-2xl text-neutral-700 font-medium'>{state}</h1>
                <p className='text-sm'>Welcome back! Please {state} to continue</p>

                {state != 'Login' && <div className='border px-6 flex items-center gap-2 rounded-full mt-5'>
                    <img src={assets.profile_icon} alt="" width={20} />
                    <input onChange={ e =>SetName(e.target.value)} value={name} className='outline-none text-sm' type="text" placeholder='Full name' required />
                </div>}

                <div className='border px-6 flex items-center gap-2 rounded-full mt-4'>
                    <img src={assets.email_icon} alt="" />
                    <input onChange={ e =>Setemail(e.target.value)} value={email} className='outline-none text-sm' type="email" placeholder='Email Id' required />
                </div>

                <div className='border px-6 flex items-center gap-2 rounded-full mt-4 my-4 '>
                    <img src={assets.lock_icon} alt="" />
                    <input onChange={ e =>Setpassword(e.target.value)} value={password} className='outline-none text-sm ' type="password" placeholder='Password' required />
                </div>

                {state === 'Login' && <p className='text-sm text-blue-600 my-4 cursor-pointer'>Forgot Password</p>}

                <button className='bg-blue-600 w-full text-white py-2 rounded-full'>{state === 'Login' ? 'Login' : ' Create Account'}</button>

                {state === 'Login' ? <p onClick={() => setState('Sign Up')} className='mt-5 text-center'>Don't have an Account? <span className='text-blue-600 cursor-pointer'>Sign Up</span></p> :
                    <p onClick={() => setState('Login')} className='mt-5 text-center'>Already have an Account? <span className='text-blue-600 cursor-pointer'>Login</span></p>}

                <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" className='absolute top-5 right-5 cursor-pointer' />
            </motion.form>
        </div>
    )
}

export default Login
