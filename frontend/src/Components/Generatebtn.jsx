import React , { useContext } from 'react'
import { assets } from '../assets/assets'
import { motion } from 'motion/react'
import { AppContext } from '../Context/AppContext'
import { useNavigate } from 'react-router-dom'


const Generatebtn = () => {
    const {user,setShowLogin,credit} =useContext(AppContext);
    const navigate= useNavigate();

    const onclickHandler = () =>{
        if(user){
            if(credit==0){
                navigate('/buy');
            }
            else{
                navigate('/result');
            }
        }
        else{
            setShowLogin(true);
        }
    }


    return (
        <motion.div
            initial={{ opacity: 0.2, y: 100 }}
            transition={{ duration: 1 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}

            className='pb-16 text-center '>
            <h1 className='text-2xl md:text-3xl lg:text-4xl mt-4 font-semibold text-neutral-800 py-6 md:py-16'>See the magic. Try now</h1>
            <button 
            onClick={onclickHandler}
            className='inline-flex items-center gap-2 px-12 py-3 rounded-full bg-black text-white m-auto hover:scale-105 transition-all duration-500 cursor-pointer'>Generate Images
                <img src={assets.star_group} alt="" className='h-6' />
            </button>
        </motion.div>
    )
}

export default Generatebtn
