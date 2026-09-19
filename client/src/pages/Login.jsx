import React from "react"
import { AppContent } from "../context/AppContext";
import logo from '../assets/mern-auth-assets/assets/logo.svg';
import person_icon from '../assets/mern-auth-assets/assets/person_icon.svg';
import mail_icon from '../assets/mern-auth-assets/assets/mail_icon.svg';
import lock_icon from '../assets/mern-auth-assets/assets/lock_icon.svg';
import { useNavigate } from "react-router-dom"; 
import { useContext, useState } from 'react'
import axios from 'axios'
import {  toast } from 'react-toastify';
const Login=()=>{
    const navigate=useNavigate()
    const { backendUrl ,setIsLoggedin,getUserData} = useContext(AppContent)
    const[state,setState]= useState('Sign Up');
    const[name,setName]=useState('')

    const[email,setEmail]=useState('')
const[password,setPassword]=useState('')
const [showPassword, setShowPassword] = useState(false);
 const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
const onSubmitHandler=async(e)=>{
   
    try {
        console.log('backendUrl:', backendUrl); // Log the backend URL for debugging
        console.log('Form data:', { name, email, password }); // Log the form data for debugging    
        console.log('Current state:', state); // Log the current state (Sign Up or Login) for debugging 
         e.preventDefault();
        axios.defaults.withCredentials=true;
         
        if(state==='Sign Up'){
            const { data } = await axios.post(backendUrl+"/api/auth/register",{name,email,password});
        
    console.log("kkkk")
         if(data.success){
            setIsLoggedin(true);
            getUserData()
            
    console.log("kkkk")
            navigate('/');
        }
            else{
            toast.error(data.message);
            console.log('hi')
        }
    }
        else{
            const { data } = await axios.post(backendUrl+"/api/auth/login",{email,password});
        
  
        if(data.success){
   
            setIsLoggedin(true);
            
            getUserData()
            
  
            navigate('/');
            

        }
        else{
            toast.error(data.message);
        }
    }
    }
     catch (error) {
        

        toast.error(error.response?.data?.message || error.message)
    }
}
        return (
            <div className=' flex min-h-screen items-center justify-center bg-linear-to-br from-blue-200 to-purple-400 p-6 sm:px-0'>
                <img onClick={()=>navigate('/')}src={logo} alt='Logo' className='absolute left-5 top-5 w-28 cursor-pointer sm:top-20 sm:w-32' />
                <div className="bg-slate-800 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm  text-center ">
                    <h2 className="text-3xl font-semibold text-white text-center mb-3" >
                    
                        {state === 'Sign Up' ? 'Create account' : 'Login account'}
                    </h2>
                    <p >
                        {state === 'Sign Up' ? 'Create your account' : 'Login to your account'}
                    </p>
                    <form onSubmit={onSubmitHandler}>{state === 'Sign Up' && (
                        <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                        <img src={person_icon} alt="" />
                        <input onChange={e=>setName(e.target.value)} value={name}className="bg-transparent outline-none w-full" type="text" placeholder="Full Name" required />
                    </div>
                    )}

                
                <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                        <img  src={mail_icon} alt="" />
                        <input onChange={e=>setEmail(e.target.value)} 
                        type='email' value={email} className="bg-transparent outline-none w-full"  placeholder="Email Id" required /></div>


            
                <div className='mb-4 flex w-full items-center gap-3 rounded-full bg-[#333A5C] px-5 py-2.5'>
                        <img src={lock_icon} alt="" className='h-5 w-5 shrink-0' />
                        <input onChange={e=>setPassword(e.target.value) }  value={password} className='min-w-0 flex-1 bg-transparent text-white outline-none' type={showPassword ? "text" : "password"} placeholder="password" required />
                        <button type="button" onClick={togglePasswordVisibility} className="shrink-0 text-xs text-indigo-200">
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                    
                    <p onClick={()=>navigate('/reset-password')} className='mb-4 text-indigo-500 cursor-pointer'>Forget Password?</p>


                         <button type='submit' style={{ background: 'linear-gradient(to right, #818cf8, #3730a3)' }} className='w-full rounded-full py-2.5 font-medium text-white'>{state}</button>
                         
                         
              </form>
              {state==='Sign Up'?(
              <p className='text-gray-400 text-center text-xs mt-4'>Already have an account?{''}
              <span onClick={()=>setState('Login')} className='text-blue-400 cursor-pointer underline'>Login here</span></p>
          ):( <p className='text-gray-400 text-center text-xs mt-4'>Don't have an account?{''}
              <span onClick={()=>setState('Sign Up')} className='text-blue-400 cursor-pointer underline'>Sign up</span></p> 
          )}
          </div>
         </div>
       
       
       
        )


    }
export default Login;