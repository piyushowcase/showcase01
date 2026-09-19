import React from "react"
// import { resetPassword } from "../../../../server/controllers/authController"
import { AppContent } from "../context/AppContext";
import logo from '../assets/mern-auth-assets/assets/logo.svg';
import { useNavigate } from "react-router-dom"; 
import { useContext, useState } from 'react'
import axios from 'axios'
import {  toast } from 'react-toastify';
import {assets} from '../assets/mern-auth-assets/assets/assets.js'
import { useRef } from "react";
import { useEffect } from "react";
const ResetPassword=()=>{
    const { backendUrl } = useContext(AppContent);
    axios.defaults.withCredentials=true;
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [newPassword, setnewPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const[isEmailSent,setisEmailSent]=useState(false)
    const[Otp,setOtp]=useState(0)
    const[isOtpSubmitted,setisOtpSubmitted]=useState(false)
    const inputRefs = useRef([]);
  const handleInput=(e,index)=>{
    if(e.target.value.length> 0 && index<inputRefs.current.length-1){
      inputRefs.current[index + 1].focus();
    }
  };
  const handleKeyDown=(e,index)=>{
    if(e.key==='Backspace' && index>0 && e.target.value.length===0){
      inputRefs.current[index-1].focus();
    }
  };
  const handlePaste=(e)=>{
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text');
    const pasteValues = pasteData.split('').slice(0, 6);
    pasteValues.forEach((value, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = value;
      }})}
    const onSubmitEmail = async (e) => {  
        e.preventDefault();
        try{
            const {data}= await axios.post(backendUrl+'/api/auth/send-reset-otp',{email})
            if(data.success){
                setisEmailSent(true)
                toast.success(data.message)
            }
            else{
                toast.error(data.message)
            }   

    }catch(error){
        toast.error(error.response?.data?.message || error.message)
    }}
    const onSubmitOTP=async (e)=>{
e.preventDefault()
const otpArray = inputRefs.current.map(e => e.value.trim()||'').join('');
if (otpArray.length !== 6) {
    toast.error('Please enter a 6-digit OTP.');
    return;
   }else{
    setOtp(otpArray)
    setisOtpSubmitted(true)
   }
    }
     const onSubmitNewPassword=async(e)=>{
        e.preventDefault(); 
        try{
            const {data}= await axios.post(backendUrl+'/api/auth/reset-password',{email:email.trim(),otp:Otp.trim(),newPassword})
            if(data.success){

                toast.success(data.message)
                navigate('/login')
            }
            else{
                toast.error(data.message)
            }
        }
        catch(error){
            toast.error(error.response?.data?.message || error.message)
        }}
    return(
        <div className=' flex min-h-screen items-center justify-center bg-linear-to-br from-blue-200 to-purple-400 p-6 sm:px-0'>
                        <img onClick={()=>navigate('/')}src={logo} alt='Logo' className='absolute left-5 top-5 w-28 cursor-pointer sm:top-20 sm:w-32' /> 
{/* // enter email id */}
{!isEmailSent && 
   <form onSubmit={onSubmitEmail} className="bg-slate-900 p-8 rounded-lg shadow-lg text-sm w-96  ">
     <h1 className='text-2xl font-semibold text-center text-white mb-4'>Reset Password</h1>
    <p className='mb-6 text-indigo-300 text-center'>Enter your registered email address</p>
    <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
        <img src={assets.mail_icon} alt="" className="w-5 h-5" />
        <input type="email" placeholder='Enter your email' className='bg-transparent outline-none w-full text-white' 
        value={email}
        onChange={(e) => setEmail(e.target.value)} required
        />
    </div>
    <button type='submit' className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3'>submit</button>
    <p className='mt-4 text-indigo-400 text-sm'>Remember your password? <span onClick={()=>navigate('/login')} className='text-blue-500 cursor-pointer'>Login</span></p>

                        </form>}
  {/* otp input form */}
  {!isOtpSubmitted && isEmailSent &&
   <form onSubmit={onSubmitOTP} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm  "> 
    <h1 className='text-2xl font-semibold text-center text-white mb-4'>Reset Password OTP</h1>
    <p className='mb-6 text-indigo-400 text-center'>Please enter the verification code sent to your email.</p>
    <div onPaste={handlePaste} className='flex justify-between  mb-8'>
      {Array(6).fill(0).map((_,index)=>(
        <input
          type='text'
          maxLength='1'
          key={index}
          required
          className='w-12  h-12 bg-[#333A5C] text-white text-center text-xl rounded-md'
        ref={(el) => (inputRefs.current[index] = el)}
        onInput={(e) => {handleInput(e, index)}}
        onKeyDown={(e) => {handleKeyDown(e, index)}}
       
        />
      ))}</div>
      <button
        type='submit'
        className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900  text-white font-semibold rounded-full transition duration-300'
      >
        submit
      </button>

   </form>}
   {/* enter new password */}
   { isOtpSubmitted&& isEmailSent &&
   <form onSubmit={onSubmitNewPassword} className="bg-slate-900 p-8 rounded-lg shadow-lg text-sm w-96  ">
     <h1 className='text-2xl font-semibold text-center text-white mb-4'>New Password</h1>
    <p className='mb-6 text-indigo-300 text-center'>Enter the new password below</p>
    <div className="mb-4 flex w-full items-center gap-3 rounded-full bg-[#333A5C] px-5 py-2.5">
        <img src={assets.lock_icon} alt="" className="w-5 h-5" />
      <input type={showNewPassword ? 'text' : 'password'} placeholder='password' className='min-w-0 flex-1 bg-transparent text-white outline-none' 
        value={newPassword}
        onChange={(e) => setnewPassword(e.target.value)} required
        />
        <button type='button' onClick={() => setShowNewPassword((previous) => !previous)} className='shrink-0 text-xs text-indigo-200'>
          {showNewPassword ? 'Hide' : 'Show'}
        </button>
    </div>
    <button type='submit' className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3'>submit</button>
    <p className='mt-4 text-indigo-400 text-sm'>Remember your password? <span onClick={()=>navigate('/login')} className='text-blue-500 cursor-pointer'>Login</span></p>

                        </form>
}
                         </div>
    )
}
export default ResetPassword;